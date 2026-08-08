// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Minimal local mirror of the Flare Confidential Compute registries from
// `flare-smart-contracts-v2`. These are not yet published in the Flare
// periphery contracts package, so Heirloom declares the subset of the surface
// it uses. Live addresses are resolved at deploy time rather than hardcoded.
//
// Replace with the upstream import once flare-smart-contracts-v2 ships as a package:
//   import { ITeeExtensionRegistry } from "flare-smart-contracts-v2/contracts/userInterfaces/tee/ITeeExtensionRegistry.sol";
interface ITeeExtensionRegistry {
    struct TeeInstructionParams {
        bytes32 opType;
        bytes32 opCommand;
        bytes message;
        address[] cosigners;
        uint64 cosignersThreshold;
        address claimBackAddress;
    }

    /// The only entry point for submitting instructions to a TEE extension.
    /// Reverts unless `msg.sender` is the InstructionSender bound to the extension.
    function sendInstructions(
        address[] calldata _teeIds,
        TeeInstructionParams calldata _params
    ) external payable returns (bytes32 _instructionId);

    /// Public extension IDs start at 0x10000; lower IDs are reserved for system extensions.
    function nextPublicExtensionId() external view returns (uint256);

    function getTeeExtensionInstructionsSender(uint256 _extensionId) external view returns (address);
}

interface ITeeMachineRegistry {
    /// Selects `_count` TEE machine addresses currently serving `_extensionId`.
    function getRandomTeeIds(uint256 _extensionId, uint256 _count)
        external
        view
        returns (address[] memory);
}
