/** Extension configuration constants. */

export const VERSION = "0.1.0";

/**
 * OPType and OPCommand constants.
 *
 * These must match the `bytes32` constants in HeirloomVault.sol exactly. A
 * mismatched OPType falls through to "unsupported op type" and the instruction
 * is silently useless, so treat these as a shared contract with the Solidity.
 *
 *   bytes32 public constant OP_TYPE_HEIRLOOM  = bytes32("HEIRLOOM");
 *   bytes32 public constant OP_COMMAND_SEAL   = bytes32("SEAL");
 *   bytes32 public constant OP_COMMAND_EXECUTE = bytes32("EXECUTE");
 */
export const OP_TYPE_HEIRLOOM = "HEIRLOOM";
export const OP_COMMAND_SEAL = "SEAL";
export const OP_COMMAND_EXECUTE = "EXECUTE";
