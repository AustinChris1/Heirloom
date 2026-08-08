import { expect } from "chai";
import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// The address baked into the Flare periphery `ContractRegistry` library.
const FLARE_CONTRACT_REGISTRY = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

const DAY = 24 * 60 * 60;
const HEARTBEAT_INTERVAL = 90 * DAY;
const GRACE_WINDOW = 30 * DAY;
const HEARTBEAT_DROPS = 1_000n; // 0.001 XRP
const TAG_BASE = 700_000_000;
const PRICE_E18 = 2_500_000_000_000_000_000n; // $2.50 / XRP, matching MockFtsoV2

const XRPL_ACCOUNT = ethers.keccak256(ethers.toUtf8Bytes("rAliceEstateAccount"));
const BEACON = ethers.keccak256(ethers.toUtf8Bytes("rHeirloomBeacon"));

/** Builds an XRPPayment proof shaped like a valid heartbeat, with overrides. */
function heartbeatProof(overrides: Partial<Record<string, unknown>> = {}) {
  const responseBody = {
    blockNumber: 100n,
    blockTimestamp: 0n,
    sourceAddress: "rAliceEstateAccount",
    sourceAddressHash: XRPL_ACCOUNT,
    receivingAddressHash: BEACON,
    intendedReceivingAddressHash: BEACON,
    spentAmount: 1_012n,
    intendedSpentAmount: 1_012n,
    receivedAmount: 1_000n,
    intendedReceivedAmount: 1_000n,
    hasMemoData: false,
    firstMemoData: "0x",
    hasDestinationTag: true,
    destinationTag: BigInt(TAG_BASE),
    status: 0,
    ...overrides,
  };

  return {
    merkleProof: [],
    data: {
      attestationType: ethers.encodeBytes32String("XRPPayment"),
      sourceId: ethers.encodeBytes32String("testXRP"),
      votingRound: 1n,
      lowestUsedTimestamp: 0n,
      requestBody: {
        transactionId: ethers.keccak256(ethers.toUtf8Bytes("xrpl-tx-1")),
        proofOwner: ethers.ZeroAddress,
      },
      responseBody,
    },
  };
}

/** Builds an XRPPaymentNonexistence proof covering a full missed interval. */
function dormancyProof(
  lastHeartbeat: bigint,
  reqOverrides: Partial<Record<string, unknown>> = {},
  resOverrides: Partial<Record<string, unknown>> = {},
) {
  return {
    merkleProof: [],
    data: {
      attestationType: ethers.encodeBytes32String("XRPPaymentNonexistence"),
      sourceId: ethers.encodeBytes32String("testXRP"),
      votingRound: 1n,
      lowestUsedTimestamp: 0n,
      requestBody: {
        minimalBlockNumber: 10n,
        deadlineBlockNumber: 9_999n,
        deadlineTimestamp: lastHeartbeat + BigInt(HEARTBEAT_INTERVAL) + 1n,
        destinationAddressHash: BEACON,
        amount: HEARTBEAT_DROPS - 1n,
        checkFirstMemoData: false,
        firstMemoDataHash: ethers.ZeroHash,
        checkDestinationTag: true,
        destinationTag: BigInt(TAG_BASE),
        proofOwner: ethers.ZeroAddress,
        ...reqOverrides,
      },
      responseBody: {
        minimalBlockTimestamp: lastHeartbeat - 1n,
        firstOverflowBlockNumber: 10_000n,
        firstOverflowBlockTimestamp: lastHeartbeat + BigInt(HEARTBEAT_INTERVAL) + 2n,
        ...resOverrides,
      },
    },
  };
}

/** Signs a payload exactly as a Flare TEE node signs an ActionResult. */
async function signTeeResult(
  tee: HardhatEthersSigner,
  resultData: string,
  actionId: string,
  submissionTag: string,
  status: number,
) {
  const resultHash = ethers.solidityPackedKeccak256(
    ["bytes32", "bytes32", "bytes32", "uint8"],
    [ethers.keccak256(resultData), actionId, ethers.keccak256(ethers.toUtf8Bytes(submissionTag)), status],
  );
  const payloadHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32", "uint256", "bytes32"],
      [ethers.encodeBytes32String("TEE_ACTION_RESULT"), network.config.chainId ?? 31337, resultHash],
    ),
  );
  // signMessage over the 32 raw bytes applies the EIP-191 prefix.
  return tee.signMessage(ethers.getBytes(payloadHash));
}

describe("HeirloomVault", () => {
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let guardian1: HardhatEthersSigner;
  let guardian2: HardhatEthersSigner;
  let relayer: HardhatEthersSigner;
  let tee: HardhatEthersSigner;

  let vault: any;
  let fdc: any;
  let ftso: any;
  let extRegistry: any;
  let registry: any;

  const WILL_COMMITMENT = ethers.keccak256(ethers.toUtf8Bytes("alice-will-v1"));
  const ENCRYPTED_WILL = "0xdeadbeefcafe";

  beforeEach(async () => {
    [owner, alice, guardian1, guardian2, relayer, tee] = await ethers.getSigners();

    fdc = await (await ethers.getContractFactory("MockFdcVerification")).deploy();
    ftso = await (await ethers.getContractFactory("MockFtsoV2")).deploy();
    extRegistry = await (await ethers.getContractFactory("MockTeeExtensionRegistry")).deploy();
    const machineRegistry = await (await ethers.getContractFactory("MockTeeMachineRegistry")).deploy();

    // Install the mock registry at the address the periphery library hardcodes.
    const mockRegistry = await (await ethers.getContractFactory("MockFlareContractRegistry")).deploy();
    const code = await ethers.provider.getCode(await mockRegistry.getAddress());
    await network.provider.send("hardhat_setCode", [FLARE_CONTRACT_REGISTRY, code]);
    registry = await ethers.getContractAt("MockFlareContractRegistry", FLARE_CONTRACT_REGISTRY);
    await registry.setContractAddress("FdcVerification", await fdc.getAddress());
    await registry.setContractAddress("FtsoV2", await ftso.getAddress());

    vault = await (await ethers.getContractFactory("HeirloomVault")).deploy(
      await extRegistry.getAddress(),
      await machineRegistry.getAddress(),
    );

    await extRegistry.registerExtension(await vault.getAddress());
    await vault.setExtensionId();
    await vault.setTeeAddress(tee.address);
    await vault.configureBeacon(BEACON, HEARTBEAT_DROPS);
  });

  async function createVault(threshold = 0, guardians: string[] = []) {
    await vault
      .connect(alice)
      .createVault(XRPL_ACCOUNT, HEARTBEAT_INTERVAL, GRACE_WINDOW, guardians, threshold, WILL_COMMITMENT);
    return 0;
  }

  /** Drives a vault to Executing: seal → attest → go silent → claim dormancy → wait out grace. */
  async function driveToExecuting(threshold = 0, guardians: string[] = []) {
    const id = await createVault(threshold, guardians);
    await attestWill(id);

    const v = await vault.vaults(id);
    await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);
    await vault.connect(relayer).claimDormancy(id, dormancyProof(v.lastHeartbeat));
    return id;
  }

  async function attestWill(vaultId: number, beneficiaryCount = 3) {
    const resultData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "bytes32", "uint32"],
      [await vault.getAddress(), vaultId, WILL_COMMITMENT, beneficiaryCount],
    );
    const actionId = ethers.keccak256(ethers.toUtf8Bytes("seal-action"));
    const sig = await signTeeResult(tee, resultData, actionId, "submit", 1);
    await vault.confirmSeal(resultData, actionId, "submit", 1, sig);
  }

  function encodeDistribution(vaultId: number, vaultAddr: string, priceE18: bigint, bequests: any[]) {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "bytes32", "uint256", "tuple(bytes32,uint256,address)[]"],
      [vaultAddr, vaultId, WILL_COMMITMENT, priceE18, bequests.map((b) => [b.destinationHash, b.drops, b.flareRecipient])],
    );
  }

  describe("vault creation", () => {
    it("allocates a unique XRPL destination tag per vault", async () => {
      await createVault();
      await vault
        .connect(guardian1)
        .createVault(XRPL_ACCOUNT, HEARTBEAT_INTERVAL, GRACE_WINDOW, [], 0, WILL_COMMITMENT);

      expect(await vault.heartbeatTag(0)).to.equal(TAG_BASE);
      expect(await vault.heartbeatTag(1)).to.equal(TAG_BASE + 1);
      expect(await vault.vaultCount()).to.equal(2);
    });

    it("rejects a guardian threshold larger than the guardian set", async () => {
      await expect(
        vault
          .connect(alice)
          .createVault(XRPL_ACCOUNT, HEARTBEAT_INTERVAL, GRACE_WINDOW, [guardian1.address], 2, WILL_COMMITMENT),
      ).to.be.revertedWithCustomError(vault, "InvalidConfiguration");
    });
  });

  describe("proof of life (FDC XRPPayment)", () => {
    it("accepts a valid heartbeat from any relayer and advances the clock", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({ blockTimestamp: before + 100n });

      await expect(vault.connect(relayer).proveLife(id, proof)).to.emit(vault, "HeartbeatProven");
      expect((await vault.vaults(id)).lastHeartbeat).to.equal(before + 100n);
    });

    it("rejects a heartbeat sent from a different XRPL account", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({
        blockTimestamp: before + 100n,
        sourceAddressHash: ethers.keccak256(ethers.toUtf8Bytes("rImpostor")),
      });

      await expect(vault.proveLife(id, proof)).to.be.revertedWithCustomError(vault, "HeartbeatNotForThisVault");
    });

    it("rejects a heartbeat carrying another vault's destination tag", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({ blockTimestamp: before + 100n, destinationTag: BigInt(TAG_BASE + 1) });

      await expect(vault.proveLife(id, proof)).to.be.revertedWithCustomError(vault, "HeartbeatNotForThisVault");
    });

    it("rejects an underfunded heartbeat", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({ blockTimestamp: before + 100n, receivedAmount: HEARTBEAT_DROPS - 1n });

      await expect(vault.proveLife(id, proof)).to.be.revertedWithCustomError(vault, "HeartbeatTooSmall");
    });

    it("rejects a payment that failed on the ledger", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({ blockTimestamp: before + 100n, status: 2 });

      await expect(vault.proveLife(id, proof)).to.be.revertedWithCustomError(vault, "HeartbeatFailedOnLedger");
    });

    it("rejects replay of an already-counted heartbeat", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      const proof = heartbeatProof({ blockTimestamp: before + 100n });

      await vault.proveLife(id, proof);
      await expect(vault.proveLife(id, proof)).to.be.revertedWithCustomError(vault, "StaleHeartbeat");
    });

    it("rejects a heartbeat whose FDC proof does not verify", async () => {
      const id = await createVault();
      const before = (await vault.vaults(id)).lastHeartbeat;
      await fdc.setPaymentValid(false);

      await expect(
        vault.proveLife(id, heartbeatProof({ blockTimestamp: before + 100n })),
      ).to.be.revertedWithCustomError(vault, "InvalidProof");
    });
  });

  describe("dormancy (FDC XRPPaymentNonexistence)", () => {
    it("opens the grace window when a full interval of silence is proven", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);

      await expect(vault.connect(relayer).claimDormancy(id, dormancyProof(v.lastHeartbeat))).to.emit(
        vault,
        "DormancyClaimed",
      );
      expect((await vault.vaults(id)).state).to.equal(2); // Dormant
    });

    it("rejects a search window that starts after the last heartbeat", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);

      // A gap between "last known alive" and the start of proven silence would let a
      // claimant skip over a heartbeat that actually happened.
      const proof = dormancyProof(v.lastHeartbeat, {}, { minimalBlockTimestamp: v.lastHeartbeat + 10n });
      await expect(vault.claimDormancy(id, proof)).to.be.revertedWithCustomError(vault, "SearchRangeTooLate");
    });

    it("rejects a search window that ends before the heartbeat was due", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);

      const proof = dormancyProof(v.lastHeartbeat, {
        deadlineTimestamp: v.lastHeartbeat + BigInt(HEARTBEAT_INTERVAL) - 10n,
      });
      await expect(vault.claimDormancy(id, proof)).to.be.revertedWithCustomError(vault, "SearchRangeTooShort");
    });

    it("rejects a nonexistence bound that would ignore real heartbeats", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);

      // Asking about payments above a much larger amount would let genuine
      // heartbeats slip through the search unnoticed.
      const proof = dormancyProof(v.lastHeartbeat, { amount: HEARTBEAT_DROPS * 1000n });
      await expect(vault.claimDormancy(id, proof)).to.be.revertedWithCustomError(vault, "WrongNonexistenceAmount");
    });

    it("rejects a search that did not filter on the destination tag", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);

      const proof = dormancyProof(v.lastHeartbeat, { checkDestinationTag: false });
      await expect(vault.claimDormancy(id, proof)).to.be.revertedWithCustomError(vault, "DestinationTagNotChecked");
    });

    it("lets a late heartbeat overturn a dormancy claim", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);
      await vault.claimDormancy(id, dormancyProof(v.lastHeartbeat));

      const revived = heartbeatProof({ blockTimestamp: v.lastHeartbeat + BigInt(HEARTBEAT_INTERVAL) + 5n });
      await expect(vault.connect(relayer).proveLife(id, revived)).to.emit(vault, "DormancyRevoked");
      expect((await vault.vaults(id)).state).to.equal(1); // Active
    });

    it("lets the owner overturn a dormancy claim directly", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);
      await vault.claimDormancy(id, dormancyProof(v.lastHeartbeat));

      await expect(vault.connect(alice).revokeDormancy(id)).to.emit(vault, "DormancyRevoked");
      expect((await vault.vaults(id)).state).to.equal(1);
    });

    it("clears guardian approvals when a vault comes back to life", async () => {
      const id = await driveToExecuting(2, [guardian1.address, guardian2.address]);
      await vault.connect(guardian1).guardianApprove(id);
      expect((await vault.vaults(id)).guardianApprovals).to.equal(1);

      await vault.connect(alice).revokeDormancy(id);
      expect((await vault.vaults(id)).guardianApprovals).to.equal(0);
      expect(await vault.hasApproved(id, guardian1.address)).to.equal(false);
    });
  });

  describe("execution gating", () => {
    it("refuses to execute while the grace window is still open", async () => {
      const id = await driveToExecuting();
      await expect(vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n)).to.be.revertedWithCustomError(
        vault,
        "GraceWindowOpen",
      );
    });

    it("refuses to execute until the guardian threshold is met", async () => {
      const id = await driveToExecuting(2, [guardian1.address, guardian2.address]);
      await time.increase(GRACE_WINDOW + 1);
      await vault.connect(guardian1).guardianApprove(id);

      await expect(vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n)).to.be.revertedWithCustomError(
        vault,
        "GuardiansUnsatisfied",
      );

      await vault.connect(guardian2).guardianApprove(id);
      await expect(vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n)).to.emit(vault, "ExecutionRequested");
    });

    it("refuses to execute a will the TEE never confirmed it could read", async () => {
      const id = await createVault();
      const v = await vault.vaults(id);
      await time.increaseTo(Number(v.lastHeartbeat) + HEARTBEAT_INTERVAL + 1);
      await vault.claimDormancy(id, dormancyProof(v.lastHeartbeat));
      await time.increase(GRACE_WINDOW + 1);

      await expect(vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n)).to.be.revertedWithCustomError(
        vault,
        "WillNotAttested",
      );
    });

    it("routes a HEIRLOOM/EXECUTE instruction carrying the FTSO price", async () => {
      const id = await driveToExecuting();
      await time.increase(GRACE_WINDOW + 1);
      await vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n);

      expect(await extRegistry.lastOpType()).to.equal(ethers.encodeBytes32String("HEIRLOOM"));
      expect(await extRegistry.lastOpCommand()).to.equal(ethers.encodeBytes32String("EXECUTE"));
      expect((await vault.vaults(id)).state).to.equal(3); // Executing
    });
  });

  describe("settlement (TEE signature verification)", () => {
    async function toExecuting() {
      const id = await driveToExecuting();
      await time.increase(GRACE_WINDOW + 1);
      await vault.requestExecution(id, ENCRYPTED_WILL, 1_000_000n);
      return id;
    }

    const bequests = [
      {
        destinationHash: ethers.keccak256(ethers.toUtf8Bytes("rDaughter")),
        drops: 600_000n,
        flareRecipient: ethers.ZeroAddress,
      },
      {
        destinationHash: ethers.keccak256(ethers.toUtf8Bytes("rSon")),
        drops: 400_000n,
        flareRecipient: ethers.ZeroAddress,
      },
    ];

    it("records a distribution signed by the registered TEE", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, await vault.getAddress(), PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);

      await expect(vault.settleEstate(data, actionId, "submit", 1, sig)).to.emit(vault, "EstateSettled");

      expect((await vault.vaults(id)).state).to.equal(4); // Settled
      const recorded = await vault.distributionOf(id);
      expect(recorded.length).to.equal(2);
      expect(recorded[0].drops).to.equal(600_000n);
    });

    it("rejects a distribution signed by anyone other than the TEE", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, await vault.getAddress(), PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(relayer, data, actionId, "submit", 1);

      await expect(vault.settleEstate(data, actionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "UnauthorizedTee",
      );
    });

    it("rejects a signature lifted from a different instruction", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, await vault.getAddress(), PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);
      const otherActionId = ethers.keccak256(ethers.toUtf8Bytes("some-other-action"));

      await expect(vault.settleEstate(data, otherActionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "UnauthorizedTee",
      );
    });

    it("rejects a distribution whose payload was altered after signing", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, await vault.getAddress(), PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);

      const tampered = encodeDistribution(id, await vault.getAddress(), PRICE_E18, [
        { ...bequests[0], drops: 999_999n },
        bequests[1],
      ]);

      await expect(vault.settleEstate(tampered, actionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "UnauthorizedTee",
      );
    });

    it("rejects a settlement for a will the owner never sealed", async () => {
      const id = await toExecuting();
      const wrongCommitment = ethers.keccak256(ethers.toUtf8Bytes("forged-will"));
      const data = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "bytes32", "uint256", "tuple(bytes32,uint256,address)[]"],
        [
          await vault.getAddress(),
          id,
          wrongCommitment,
          PRICE_E18,
          bequests.map((b) => [b.destinationHash, b.drops, b.flareRecipient]),
        ],
      );
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);

      await expect(vault.settleEstate(data, actionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "CommitmentMismatch",
      );
    });

    it("rejects a settlement priced far away from the FTSO feed", async () => {
      const id = await toExecuting();
      // The enclave claims XRP is worth 4x what the feed says.
      const data = encodeDistribution(id, await vault.getAddress(), 10n * 10n ** 18n, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);

      await expect(vault.settleEstate(data, actionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "PriceOutsideTolerance",
      );
    });

    it("rejects a result the TEE itself reported as failed", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, await vault.getAddress(), PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 0);

      await expect(vault.settleEstate(data, actionId, "submit", 0, sig)).to.be.revertedWithCustomError(
        vault,
        "TeeReportedFailure",
      );
    });

    it("rejects a settlement addressed to a different contract", async () => {
      const id = await toExecuting();
      const data = encodeDistribution(id, relayer.address, PRICE_E18, bequests);
      const actionId = ethers.keccak256(ethers.toUtf8Bytes("exec-action"));
      const sig = await signTeeResult(tee, data, actionId, "submit", 1);

      await expect(vault.settleEstate(data, actionId, "submit", 1, sig)).to.be.revertedWithCustomError(
        vault,
        "SettlementNotForThisContract",
      );
    });
  });

  describe("FTSO pricing", () => {
    it("converts drops to USD at the live feed price", async () => {
      await ftso.setPrice(3n * 10n ** 18n); // $3.00 / XRP
      // 2,000,000 drops = 2 XRP = $6.00
      expect(await vault.estateValueUsdE18(2_000_000n)).to.equal(6n * 10n ** 18n);
    });
  });
});
