// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TeeActionResult
 * @notice Verifies results returned by a Flare Confidential Compute extension.
 *
 * A TEE node does not sign the raw result hash. It signs a domain-separated
 * payload derived from it:
 *
 *   resultHash  = keccak256(keccak256(data) || actionId || keccak256(tag) || status)
 *   payloadHash = keccak256(abi.encode("TEE_ACTION_RESULT", chainId, resultHash))
 *   signature   = ECDSA over the EIP-191 personal-sign wrapping of payloadHash
 *
 * The layout must stay byte-identical to `signing.TEEActionResult` in
 * go-flare-common, otherwise recovery silently yields the wrong address and
 * every settlement reverts. Including `chainId` stops a Coston2 result from
 * being replayed on mainnet; including `actionId` binds a signature to exactly
 * one instruction.
 */
library TeeActionResult {
    bytes32 internal constant TEE_ACTION_RESULT_PREFIX = bytes32("TEE_ACTION_RESULT");

    error BadSignatureLength();
    error BadSignatureV();
    error InvalidSignature();
    error UnauthorizedTee();

    /**
     * @notice Reverts unless `signature` is a valid TEE signature over the result
     *         fields and recovers to `expectedTee`.
     * @param resultData    Exact `ActionResult.Data` bytes returned by the extension.
     *                      Must not be re-encoded — the signature covers these bytes.
     * @param actionId      `ActionResult.ID`, the instruction id from `sendInstructions`.
     * @param submissionTag `ActionResult.SubmissionTag` (typically "submit").
     * @param status        `ActionResult.Status`: 0 = error, 1 = success, >=2 = pending.
     * @param signature     65-byte [r||s||v] secp256k1 signature from the TEE node.
     * @param expectedTee   Registered TEE signing address.
     */
    function requireValid(
        bytes calldata resultData,
        bytes32 actionId,
        string calldata submissionTag,
        uint8 status,
        bytes calldata signature,
        address expectedTee
    ) internal view {
        bytes32 resultHash = keccak256(
            abi.encodePacked(keccak256(resultData), actionId, keccak256(bytes(submissionTag)), status)
        );
        bytes32 payloadHash = keccak256(abi.encode(TEE_ACTION_RESULT_PREFIX, block.chainid, resultHash));
        bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadHash));

        if (_recover(digest, signature) != expectedTee) revert UnauthorizedTee();
    }

    function _recover(bytes32 digest, bytes calldata sig) private pure returns (address) {
        if (sig.length != 65) revert BadSignatureLength();

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) revert BadSignatureV();

        address signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert InvalidSignature();
        return signer;
    }
}
