// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/coston2/IXRPPayment.sol";
import {IXRPPaymentNonexistence} from "@flarenetwork/flare-periphery-contracts/coston2/IXRPPaymentNonexistence.sol";
import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

import {ITeeExtensionRegistry, ITeeMachineRegistry} from "./interfaces/ITeeExtensionRegistry.sol";
import {TeeActionResult} from "./lib/TeeActionResult.sol";

/**
 * @title HeirloomVault
 * @notice Confidential inheritance and programmable custody for native XRP.
 *
 * A holder registers a vault bound to their XRP Ledger account and proves they
 * are alive by sending a small XRPL payment to a shared beacon address carrying
 * a destination tag unique to their vault. Both directions of that signal are
 * provable on Flare without trusting anyone:
 *
 *   - liveness  — FDC `XRPPayment` (0x08) proves a tagged heartbeat happened.
 *   - dormancy  — FDC `XRPPaymentNonexistence` (0x09) proves that across an
 *                 entire ledger range, no such payment happened.
 *
 * The will itself never touches the chain in the clear. It is ECIES-encrypted to
 * a Flare Confidential Compute extension's key; only a commitment lives on-chain.
 * On execution the TEE decrypts it, prices any fiat-denominated bequests against
 * the FTSO XRP/USD feed, and returns a signed distribution that this contract
 * verifies against both the TEE key and the stored commitment.
 *
 * This contract is also the FCC InstructionSender for the Heirloom extension —
 * the registry only accepts `sendInstructions` from the address bound to the
 * extension at registration time.
 *
 * Safety posture: dormancy is a claim, not a verdict. It opens a grace window in
 * which a single proof of life — or the owner's own transaction — reverts the
 * vault to Active. Guardians can only ever confirm; they can never seize.
 */
contract HeirloomVault {
    using TeeActionResult for bytes;

    // --------------------------------------------------------------------
    // FCC operation identifiers — must match internal/config/config.go in the
    // extension. bytes32 holds at most 31 bytes, so these stay short.
    // --------------------------------------------------------------------

    bytes32 public constant OP_TYPE_HEIRLOOM = bytes32("HEIRLOOM");
    /// Dry-run: TEE decrypts a sealed will and attests it is readable and well-formed.
    bytes32 public constant OP_COMMAND_SEAL = bytes32("SEAL");
    /// Execute: TEE decrypts the will, prices it, and returns the signed distribution.
    bytes32 public constant OP_COMMAND_EXECUTE = bytes32("EXECUTE");

    uint256 private constant FIRST_PUBLIC_EXTENSION_ID = 0x10000;

    /// FTSO feed id for XRP/USD (category byte 0x01 + "XRP/USD" padded to 21 bytes).
    bytes21 public constant XRP_USD_FEED_ID = bytes21(0x015852502f55534400000000000000000000000000);

    /// Destination tags are uint32 on XRPL. Vault tags are allocated from this base
    /// so they never collide with a wallet's own tagging conventions.
    uint32 public constant TAG_BASE = 700_000_000;

    // --------------------------------------------------------------------
    // Types
    // --------------------------------------------------------------------

    enum VaultState {
        None,
        Active, // heartbeats current
        Dormant, // dormancy proven; grace window running
        Executing, // grace elapsed and guardians satisfied; TEE instructed
        Settled, // distribution verified and recorded
        Revoked // owner closed the vault
    }

    struct Vault {
        address owner;
        bytes32 xrplAccountHash; // standard address hash of the estate's XRPL account
        uint64 heartbeatInterval; // seconds of silence before dormancy may be claimed
        uint64 lastHeartbeat; // XRPL ledger timestamp of the last proven life signal
        uint64 graceWindow; // seconds the owner has to overturn a dormancy claim
        uint64 dormantSince; // when dormancy was claimed (0 while Active)
        bytes32 willCommitment; // keccak256 over the plaintext will; set by the owner, attested by the TEE
        bool willAttested; // TEE has confirmed it can decrypt and parse the sealed will
        uint32 guardianThreshold; // confirmations required before execution (0 disables guardians)
        uint32 guardianApprovals;
        VaultState state;
    }

    /// One line of the distribution the TEE computes from the decrypted will.
    struct Bequest {
        bytes32 destinationHash; // XRPL standard address hash of the beneficiary
        uint256 drops; // XRP allocated, in drops
        address flareRecipient; // optional: receive FXRP on Flare instead of native XRP
    }

    /// ABI payload of an EXECUTE instruction, decoded inside the enclave.
    struct ExecuteMessage {
        uint256 vaultId;
        address contractAddr; // echoed back so settlement can be bound to this contract
        bytes32 willCommitment;
        bytes encryptedWill; // ECIES ciphertext of the will, opaque on-chain
        uint256 xrpUsdPriceE18; // FTSO price at request time, for fiat-denominated bequests
        uint256 estateDrops; // total XRP the estate holds, in drops
    }

    // --------------------------------------------------------------------
    // Storage
    // --------------------------------------------------------------------

    ITeeExtensionRegistry public immutable TEE_EXTENSION_REGISTRY;
    ITeeMachineRegistry public immutable TEE_MACHINE_REGISTRY;

    address public owner;
    /// Registered TEE signing address; distributions must recover to it.
    address public teeAddress;
    uint256 private _extensionId;

    /// XRPL account every heartbeat is sent to (standard address hash).
    bytes32 public beaconAddressHash;
    /// Minimum drops a payment must deliver to count as a heartbeat.
    uint256 public heartbeatDrops;

    Vault[] public vaults;

    mapping(uint256 => mapping(address => bool)) public isGuardian;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => address[]) private _guardianList;
    /// Recorded distribution per vault, written on settlement.
    mapping(uint256 => Bequest[]) private _distribution;

    // --------------------------------------------------------------------
    // Events
    // --------------------------------------------------------------------

    event VaultCreated(uint256 indexed vaultId, address indexed owner, bytes32 xrplAccountHash, uint32 heartbeatTag);
    event HeartbeatProven(uint256 indexed vaultId, uint64 ledgerTimestamp, bytes32 xrplTxId);
    event DormancyClaimed(uint256 indexed vaultId, address indexed claimant, uint64 graceEndsAt);
    event DormancyRevoked(uint256 indexed vaultId, string reason);
    event GuardianApproved(uint256 indexed vaultId, address indexed guardian, uint32 approvals, uint32 threshold);
    event WillSealed(uint256 indexed vaultId, bytes32 indexed instructionId, bytes32 willCommitment);
    event WillAttested(uint256 indexed vaultId, bytes32 willCommitment, uint32 beneficiaryCount);
    event ExecutionRequested(uint256 indexed vaultId, bytes32 indexed instructionId, uint256 xrpUsdPriceE18);
    event EstateSettled(uint256 indexed vaultId, uint256 bequestCount, uint256 totalDrops, uint256 xrpUsdPriceE18);
    event BequestRecorded(uint256 indexed vaultId, bytes32 indexed destinationHash, uint256 drops, address flareRecipient);
    event VaultRevoked(uint256 indexed vaultId);
    event TeeAddressSet(address indexed teeAddress);
    event BeaconConfigured(bytes32 beaconAddressHash, uint256 heartbeatDrops);

    // --------------------------------------------------------------------
    // Errors
    // --------------------------------------------------------------------

    error NotOwner();
    error NotVaultOwner();
    error NoSuchVault();
    error WrongState(VaultState actual, VaultState expected);
    error TeeNotConfigured();
    error BeaconNotConfigured();
    error ExtensionIdUnset();
    error ExtensionIdAlreadySet();
    error ExtensionNotFound();
    error InvalidProof();
    error HeartbeatNotForThisVault();
    error HeartbeatTooSmall(uint256 received, uint256 required);
    error HeartbeatFailedOnLedger(uint8 status);
    error StaleHeartbeat(uint64 proven, uint64 known);
    error SearchRangeTooLate(uint64 rangeStart, uint64 lastHeartbeat);
    error SearchRangeTooShort(uint64 deadline, uint64 required);
    error WrongNonexistenceAmount(uint256 got, uint256 expected);
    error DestinationTagNotChecked();
    error ProofNotUsableHere(address proofOwner);
    error GraceWindowOpen(uint64 endsAt);
    error GuardiansUnsatisfied(uint32 approvals, uint32 threshold);
    error NotGuardian();
    error AlreadyApproved();
    error WillNotAttested();
    error CommitmentMismatch(bytes32 got, bytes32 expected);
    error SettlementNotForThisContract(address target);
    error TeeReportedFailure(uint8 status);
    error PriceOutsideTolerance(uint256 teePrice, uint256 ftsoPrice);
    error EmptyWill();
    error InvalidConfiguration();

    // --------------------------------------------------------------------
    // Construction / administration
    // --------------------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(ITeeExtensionRegistry _teeExtensionRegistry, ITeeMachineRegistry _teeMachineRegistry) {
        if (address(_teeExtensionRegistry) == address(0) || address(_teeMachineRegistry) == address(0)) {
            revert InvalidConfiguration();
        }
        TEE_EXTENSION_REGISTRY = _teeExtensionRegistry;
        TEE_MACHINE_REGISTRY = _teeMachineRegistry;
        owner = msg.sender;
    }

    /// @notice Discovers this contract's extension id by scanning the registry.
    /// Public extension ids start at 0x10000; lower ids are system-reserved.
    function setExtensionId() external {
        if (_extensionId != 0) revert ExtensionIdAlreadySet();

        uint256 next = TEE_EXTENSION_REGISTRY.nextPublicExtensionId();
        for (uint256 i = FIRST_PUBLIC_EXTENSION_ID; i < next; ++i) {
            if (TEE_EXTENSION_REGISTRY.getTeeExtensionInstructionsSender(i) == address(this)) {
                _extensionId = i;
                return;
            }
        }
        revert ExtensionNotFound();
    }

    function extensionId() external view returns (uint256) {
        return _getExtensionId();
    }

    function setTeeAddress(address _teeAddress) external onlyOwner {
        if (_teeAddress == address(0)) revert InvalidConfiguration();
        teeAddress = _teeAddress;
        emit TeeAddressSet(_teeAddress);
    }

    /// @notice Sets the shared XRPL beacon account and the minimum heartbeat size.
    /// @param _beaconAddressHash Standard address hash (keccak256 of the r-address string).
    /// @param _heartbeatDrops Minimum drops a payment must deliver to count as a heartbeat.
    ///        Must be >= 1 so the nonexistence bound (`_heartbeatDrops - 1`) stays non-negative.
    function configureBeacon(bytes32 _beaconAddressHash, uint256 _heartbeatDrops) external onlyOwner {
        if (_beaconAddressHash == bytes32(0) || _heartbeatDrops == 0) revert InvalidConfiguration();
        beaconAddressHash = _beaconAddressHash;
        heartbeatDrops = _heartbeatDrops;
        emit BeaconConfigured(_beaconAddressHash, _heartbeatDrops);
    }

    // --------------------------------------------------------------------
    // Vault lifecycle
    // --------------------------------------------------------------------

    /// @notice Registers a vault over an XRPL account.
    /// @param _xrplAccountHash Standard address hash of the estate's XRPL account.
    /// @param _heartbeatInterval Seconds of silence after which dormancy may be claimed.
    /// @param _graceWindow Seconds the owner has to overturn a dormancy claim.
    /// @param _guardians Optional confirmers. They can only confirm, never seize.
    /// @param _guardianThreshold Confirmations required before execution; 0 disables guardians.
    /// @param _willCommitment keccak256 over the plaintext will, computed client-side.
    function createVault(
        bytes32 _xrplAccountHash,
        uint64 _heartbeatInterval,
        uint64 _graceWindow,
        address[] calldata _guardians,
        uint32 _guardianThreshold,
        bytes32 _willCommitment
    ) external returns (uint256 vaultId) {
        if (beaconAddressHash == bytes32(0)) revert BeaconNotConfigured();
        if (_xrplAccountHash == bytes32(0) || _heartbeatInterval == 0 || _willCommitment == bytes32(0)) {
            revert InvalidConfiguration();
        }
        if (_guardianThreshold > _guardians.length) revert InvalidConfiguration();

        vaultId = vaults.length;
        vaults.push(
            Vault({
                owner: msg.sender,
                xrplAccountHash: _xrplAccountHash,
                heartbeatInterval: _heartbeatInterval,
                // The clock starts now; the owner has one interval to send a first heartbeat.
                lastHeartbeat: uint64(block.timestamp),
                graceWindow: _graceWindow,
                dormantSince: 0,
                willCommitment: _willCommitment,
                willAttested: false,
                guardianThreshold: _guardianThreshold,
                guardianApprovals: 0,
                state: VaultState.Active
            })
        );

        for (uint256 i = 0; i < _guardians.length; ++i) {
            address g = _guardians[i];
            if (g == address(0) || isGuardian[vaultId][g]) revert InvalidConfiguration();
            isGuardian[vaultId][g] = true;
            _guardianList[vaultId].push(g);
        }

        emit VaultCreated(vaultId, msg.sender, _xrplAccountHash, heartbeatTag(vaultId));
    }

    /// @notice The XRPL destination tag this vault's heartbeats must carry.
    function heartbeatTag(uint256 _vaultId) public pure returns (uint32) {
        return uint32(TAG_BASE + _vaultId);
    }

    /// @notice Owner permanently closes a vault. Allowed until settlement.
    function revokeVault(uint256 _vaultId) external {
        Vault storage v = _vault(_vaultId);
        if (msg.sender != v.owner) revert NotVaultOwner();
        if (v.state == VaultState.Settled || v.state == VaultState.Revoked) {
            revert WrongState(v.state, VaultState.Active);
        }
        v.state = VaultState.Revoked;
        emit VaultRevoked(_vaultId);
    }

    // --------------------------------------------------------------------
    // Liveness — FDC XRPPayment (0x08)
    // --------------------------------------------------------------------

    /**
     * @notice Proves the vault owner is alive using an XRPL payment they sent.
     *
     * Permissionless by design: anyone may relay the proof, because a valid
     * heartbeat can only be produced by whoever controls the estate's XRPL
     * account. Letting relayers submit it means a holder who is alive but
     * offline (or out of gas on Flare) is still protected.
     *
     * Accepted in both Active and Dormant states — a heartbeat landing during a
     * grace window is exactly the signal that overturns a false dormancy claim.
     */
    function proveLife(uint256 _vaultId, IXRPPayment.Proof calldata _proof) external {
        Vault storage v = _vault(_vaultId);
        if (v.state != VaultState.Active && v.state != VaultState.Dormant) {
            revert WrongState(v.state, VaultState.Active);
        }

        if (!ContractRegistry.getFdcVerification().verifyXRPPayment(_proof)) revert InvalidProof();

        IXRPPayment.ResponseBody calldata body = _proof.data.responseBody;

        // The heartbeat must originate from the estate's own XRPL account and land
        // on the beacon carrying this vault's tag. Without the source check anyone
        // could keep a dead holder's vault alive; without the tag check a payment
        // for a different vault would count.
        if (body.sourceAddressHash != v.xrplAccountHash) revert HeartbeatNotForThisVault();
        if (body.receivingAddressHash != beaconAddressHash) revert HeartbeatNotForThisVault();
        if (!body.hasDestinationTag || body.destinationTag != heartbeatTag(_vaultId)) {
            revert HeartbeatNotForThisVault();
        }
        if (body.status != 0) revert HeartbeatFailedOnLedger(body.status);
        if (body.receivedAmount < int256(heartbeatDrops)) {
            revert HeartbeatTooSmall(uint256(body.receivedAmount), heartbeatDrops);
        }
        // Replay guard: a heartbeat only counts if it is newer than the one on record.
        if (body.blockTimestamp <= v.lastHeartbeat) revert StaleHeartbeat(body.blockTimestamp, v.lastHeartbeat);

        v.lastHeartbeat = body.blockTimestamp;

        if (v.state == VaultState.Dormant) {
            v.state = VaultState.Active;
            v.dormantSince = 0;
            _resetGuardianApprovals(_vaultId);
            emit DormancyRevoked(_vaultId, "proof of life");
        }

        emit HeartbeatProven(_vaultId, body.blockTimestamp, _proof.data.requestBody.transactionId);
    }

    // --------------------------------------------------------------------
    // Dormancy — FDC XRPPaymentNonexistence (0x09)
    // --------------------------------------------------------------------

    /**
     * @notice Proves no heartbeat occurred across a full interval, opening the grace window.
     *
     * The attestation asserts that in the ledger range it covers, no payment
     * delivering more than `requestBody.amount` reached the beacon with this
     * vault's destination tag. To turn that into "the owner missed their
     * heartbeat" the range must both start no later than the last known
     * heartbeat and extend past the deadline — otherwise a claimant could prove
     * silence over some unrelated window.
     */
    function claimDormancy(uint256 _vaultId, IXRPPaymentNonexistence.Proof calldata _proof) external {
        Vault storage v = _vault(_vaultId);
        if (v.state != VaultState.Active) revert WrongState(v.state, VaultState.Active);

        if (!ContractRegistry.getFdcVerification().verifyXRPPaymentNonexistence(_proof)) revert InvalidProof();

        IXRPPaymentNonexistence.RequestBody calldata req = _proof.data.requestBody;
        IXRPPaymentNonexistence.ResponseBody calldata res = _proof.data.responseBody;

        if (req.proofOwner != address(0) && req.proofOwner != address(this)) {
            revert ProofNotUsableHere(req.proofOwner);
        }
        // The search must target this vault's heartbeat channel exactly.
        if (req.destinationAddressHash != beaconAddressHash) revert HeartbeatNotForThisVault();
        if (!req.checkDestinationTag) revert DestinationTagNotChecked();
        if (req.destinationTag != heartbeatTag(_vaultId)) revert HeartbeatNotForThisVault();

        // The attestation excludes payments delivering *more than* `amount`. Asking for
        // `heartbeatDrops - 1` therefore excludes everything that would have counted as
        // a heartbeat (>= heartbeatDrops), and nothing less.
        uint256 expectedAmount = heartbeatDrops - 1;
        if (req.amount != expectedAmount) revert WrongNonexistenceAmount(req.amount, expectedAmount);

        // The window must open at or before the last proven heartbeat, so no gap
        // exists between "last known alive" and "start of proven silence".
        if (res.minimalBlockTimestamp > v.lastHeartbeat) {
            revert SearchRangeTooLate(res.minimalBlockTimestamp, v.lastHeartbeat);
        }
        // ...and it must run past the point the heartbeat was due.
        uint64 dueAt = v.lastHeartbeat + v.heartbeatInterval;
        if (req.deadlineTimestamp < dueAt) revert SearchRangeTooShort(req.deadlineTimestamp, dueAt);

        v.state = VaultState.Dormant;
        v.dormantSince = uint64(block.timestamp);

        emit DormancyClaimed(_vaultId, msg.sender, uint64(block.timestamp) + v.graceWindow);
    }

    /// @notice Owner overturns a dormancy claim directly. The permissionless
    /// equivalent is `proveLife`, which needs no Flare-side key at all.
    function revokeDormancy(uint256 _vaultId) external {
        Vault storage v = _vault(_vaultId);
        if (msg.sender != v.owner) revert NotVaultOwner();
        if (v.state != VaultState.Dormant) revert WrongState(v.state, VaultState.Dormant);

        v.state = VaultState.Active;
        v.dormantSince = 0;
        v.lastHeartbeat = uint64(block.timestamp);
        _resetGuardianApprovals(_vaultId);

        emit DormancyRevoked(_vaultId, "owner override");
    }

    /// @notice A guardian confirms the dormancy claim. Confirmation only ever adds
    /// friction before execution; guardians cannot move funds or alter the will.
    function guardianApprove(uint256 _vaultId) external {
        Vault storage v = _vault(_vaultId);
        if (v.state != VaultState.Dormant) revert WrongState(v.state, VaultState.Dormant);
        if (!isGuardian[_vaultId][msg.sender]) revert NotGuardian();
        if (hasApproved[_vaultId][msg.sender]) revert AlreadyApproved();

        hasApproved[_vaultId][msg.sender] = true;
        v.guardianApprovals += 1;

        emit GuardianApproved(_vaultId, msg.sender, v.guardianApprovals, v.guardianThreshold);
    }

    // --------------------------------------------------------------------
    // Confidential compute — sealing and execution
    // --------------------------------------------------------------------

    /**
     * @notice Asks the TEE to decrypt a sealed will and attest that it is readable.
     *
     * This is a dry run the owner performs while alive. Without it, a corrupt or
     * mis-encrypted ciphertext would only surface at execution — when the one
     * person who could fix it is gone. The plaintext never leaves the enclave;
     * only a commitment and a beneficiary count come back.
     */
    function sealWill(uint256 _vaultId, bytes calldata _encryptedWill) external payable returns (bytes32 instructionId) {
        Vault storage v = _vault(_vaultId);
        if (msg.sender != v.owner) revert NotVaultOwner();
        if (v.state != VaultState.Active) revert WrongState(v.state, VaultState.Active);
        if (_encryptedWill.length == 0) revert EmptyWill();

        bytes memory message = abi.encode(
            ExecuteMessage({
                vaultId: _vaultId,
                contractAddr: address(this),
                willCommitment: v.willCommitment,
                encryptedWill: _encryptedWill,
                xrpUsdPriceE18: 0,
                estateDrops: 0
            })
        );

        instructionId = _sendInstruction(OP_COMMAND_SEAL, message);
        emit WillSealed(_vaultId, instructionId, v.willCommitment);
    }

    /// @notice Records the TEE's attestation that the sealed will is decryptable and well-formed.
    /// @param _resultData abi.encode(address contractAddr, uint256 vaultId, bytes32 willCommitment, uint32 beneficiaryCount)
    function confirmSeal(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) external {
        _requireTeeResult(_resultData, _actionId, _submissionTag, _status, _signature);

        (address contractAddr, uint256 vaultId, bytes32 commitment, uint32 beneficiaryCount) =
            abi.decode(_resultData, (address, uint256, bytes32, uint32));

        if (contractAddr != address(this)) revert SettlementNotForThisContract(contractAddr);

        Vault storage v = _vault(vaultId);
        if (commitment != v.willCommitment) revert CommitmentMismatch(commitment, v.willCommitment);
        if (beneficiaryCount == 0) revert EmptyWill();

        v.willAttested = true;
        emit WillAttested(vaultId, commitment, beneficiaryCount);
    }

    /**
     * @notice Instructs the TEE to execute the will once dormancy is final.
     *
     * Requires the grace window to have elapsed and the guardian threshold to be
     * met. The current FTSO XRP/USD price rides along so the enclave can settle
     * fiat-denominated bequests ("$50,000 to my daughter") against a value the
     * chain also observed.
     */
    function requestExecution(uint256 _vaultId, bytes calldata _encryptedWill, uint256 _estateDrops)
        external
        payable
        returns (bytes32 instructionId)
    {
        Vault storage v = _vault(_vaultId);
        if (v.state != VaultState.Dormant) revert WrongState(v.state, VaultState.Dormant);
        if (!v.willAttested) revert WillNotAttested();

        uint64 graceEndsAt = v.dormantSince + v.graceWindow;
        if (block.timestamp < graceEndsAt) revert GraceWindowOpen(graceEndsAt);
        if (v.guardianApprovals < v.guardianThreshold) {
            revert GuardiansUnsatisfied(v.guardianApprovals, v.guardianThreshold);
        }

        (uint256 priceE18,) = xrpUsdPrice();

        bytes memory message = abi.encode(
            ExecuteMessage({
                vaultId: _vaultId,
                contractAddr: address(this),
                willCommitment: v.willCommitment,
                encryptedWill: _encryptedWill,
                xrpUsdPriceE18: priceE18,
                estateDrops: _estateDrops
            })
        );

        v.state = VaultState.Executing;
        instructionId = _sendInstruction(OP_COMMAND_EXECUTE, message);
        emit ExecutionRequested(_vaultId, instructionId, priceE18);
    }

    /**
     * @notice Verifies and records the TEE's signed distribution.
     * @param _resultData abi.encode(address contractAddr, uint256 vaultId, bytes32 willCommitment,
     *        uint256 xrpUsdPriceE18, Bequest[] bequests)
     *
     * Three independent checks have to pass before a distribution is accepted:
     * the signature must recover to the registered TEE, the revealed commitment
     * must match what the owner sealed, and the price the enclave used must sit
     * within tolerance of the FTSO feed. The first proves the enclave produced
     * it, the second proves it executed *this* will, the third bounds how far a
     * stale or manipulated price could skew fiat-denominated bequests.
     */
    function settleEstate(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) external {
        _requireTeeResult(_resultData, _actionId, _submissionTag, _status, _signature);

        (address contractAddr, uint256 vaultId, bytes32 commitment, uint256 teePriceE18, Bequest[] memory bequests) =
            abi.decode(_resultData, (address, uint256, bytes32, uint256, Bequest[]));

        if (contractAddr != address(this)) revert SettlementNotForThisContract(contractAddr);

        Vault storage v = _vault(vaultId);
        if (v.state != VaultState.Executing) revert WrongState(v.state, VaultState.Executing);
        if (commitment != v.willCommitment) revert CommitmentMismatch(commitment, v.willCommitment);
        if (bequests.length == 0) revert EmptyWill();

        _requirePriceWithinTolerance(teePriceE18);

        uint256 totalDrops;
        for (uint256 i = 0; i < bequests.length; ++i) {
            Bequest memory b = bequests[i];
            totalDrops += b.drops;
            _distribution[vaultId].push(b);
            emit BequestRecorded(vaultId, b.destinationHash, b.drops, b.flareRecipient);
        }

        v.state = VaultState.Settled;
        emit EstateSettled(vaultId, bequests.length, totalDrops, teePriceE18);
    }

    // --------------------------------------------------------------------
    // FTSO
    // --------------------------------------------------------------------

    /// @notice Current XRP/USD price scaled to 18 decimals, with the feed timestamp.
    /// @dev Coston2 exposes `TestFtsoV2Interface`, whose reads are free views. On
    ///      mainnet this becomes `ContractRegistry.getFtsoV2()` with a fee.
    function xrpUsdPrice() public view returns (uint256 priceE18, uint64 timestamp) {
        TestFtsoV2Interface ftso = ContractRegistry.getTestFtsoV2();
        (priceE18, timestamp) = ftso.getFeedByIdInWei(XRP_USD_FEED_ID);
    }

    /// @notice USD value of a drop amount, scaled to 18 decimals.
    function estateValueUsdE18(uint256 _drops) external view returns (uint256) {
        (uint256 priceE18,) = xrpUsdPrice();
        // 1 XRP = 1e6 drops.
        return (_drops * priceE18) / 1e6;
    }

    /// @dev A settlement priced far from the live feed is rejected. 5% absorbs the
    ///      lag between `requestExecution` and the enclave's own read without
    ///      leaving room to materially misprice a fiat bequest.
    function _requirePriceWithinTolerance(uint256 _teePriceE18) private view {
        (uint256 livePriceE18,) = xrpUsdPrice();
        if (livePriceE18 == 0 || _teePriceE18 == 0) revert PriceOutsideTolerance(_teePriceE18, livePriceE18);

        uint256 diff = _teePriceE18 > livePriceE18 ? _teePriceE18 - livePriceE18 : livePriceE18 - _teePriceE18;
        if (diff * 100 > livePriceE18 * 5) revert PriceOutsideTolerance(_teePriceE18, livePriceE18);
    }

    // --------------------------------------------------------------------
    // Views
    // --------------------------------------------------------------------

    function vaultCount() external view returns (uint256) {
        return vaults.length;
    }

    function guardiansOf(uint256 _vaultId) external view returns (address[] memory) {
        return _guardianList[_vaultId];
    }

    function distributionOf(uint256 _vaultId) external view returns (Bequest[] memory) {
        return _distribution[_vaultId];
    }

    /// @notice Seconds until a heartbeat is due; 0 once the interval has lapsed.
    function timeUntilHeartbeatDue(uint256 _vaultId) external view returns (uint64) {
        Vault storage v = _vault(_vaultId);
        uint64 dueAt = v.lastHeartbeat + v.heartbeatInterval;
        return block.timestamp >= dueAt ? 0 : dueAt - uint64(block.timestamp);
    }

    /// @notice Whether enough silence has passed that a dormancy claim would stand.
    function isHeartbeatOverdue(uint256 _vaultId) external view returns (bool) {
        Vault storage v = _vault(_vaultId);
        return block.timestamp >= v.lastHeartbeat + v.heartbeatInterval;
    }

    function canExecute(uint256 _vaultId) external view returns (bool) {
        Vault storage v = _vault(_vaultId);
        return v.state == VaultState.Dormant && v.willAttested
            && block.timestamp >= v.dormantSince + v.graceWindow && v.guardianApprovals >= v.guardianThreshold;
    }

    // --------------------------------------------------------------------
    // Internal
    // --------------------------------------------------------------------

    function _vault(uint256 _vaultId) private view returns (Vault storage v) {
        if (_vaultId >= vaults.length) revert NoSuchVault();
        v = vaults[_vaultId];
    }

    function _getExtensionId() private view returns (uint256) {
        if (_extensionId == 0) revert ExtensionIdUnset();
        return _extensionId;
    }

    function _sendInstruction(bytes32 _opCommand, bytes memory _message) private returns (bytes32) {
        address[] memory teeIds = TEE_MACHINE_REGISTRY.getRandomTeeIds(_getExtensionId(), 1);
        address[] memory cosigners = new address[](0);

        ITeeExtensionRegistry.TeeInstructionParams memory params = ITeeExtensionRegistry.TeeInstructionParams({
            opType: OP_TYPE_HEIRLOOM,
            opCommand: _opCommand,
            message: _message,
            cosigners: cosigners,
            cosignersThreshold: 0,
            claimBackAddress: msg.sender
        });

        return TEE_EXTENSION_REGISTRY.sendInstructions{value: msg.value}(teeIds, params);
    }

    function _requireTeeResult(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) private view {
        if (teeAddress == address(0)) revert TeeNotConfigured();
        if (_status != 1) revert TeeReportedFailure(_status);
        TeeActionResult.requireValid(_resultData, _actionId, _submissionTag, _status, _signature, teeAddress);
    }

    function _resetGuardianApprovals(uint256 _vaultId) private {
        address[] storage gs = _guardianList[_vaultId];
        for (uint256 i = 0; i < gs.length; ++i) {
            hasApproved[_vaultId][gs[i]] = false;
        }
        vaults[_vaultId].guardianApprovals = 0;
    }
}
