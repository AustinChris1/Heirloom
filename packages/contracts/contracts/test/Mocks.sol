// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/coston2/IXRPPayment.sol";
import {IXRPPaymentNonexistence} from "@flarenetwork/flare-periphery-contracts/coston2/IXRPPaymentNonexistence.sol";
import {ITeeExtensionRegistry} from "../interfaces/ITeeExtensionRegistry.sol";

/**
 * Test doubles for the Flare protocol contracts Heirloom depends on.
 *
 * `ContractRegistry` resolves everything through a library constant address, so
 * tests install `MockFlareContractRegistry`'s runtime code at that address with
 * `hardhat_setCode` and then populate its mapping. Storage starts empty at the
 * target address, so the setters must be called after the code is installed.
 */
contract MockFlareContractRegistry {
    mapping(bytes32 => address) private _addresses;

    function setContractAddress(string calldata _name, address _addr) external {
        _addresses[keccak256(abi.encode(_name))] = _addr;
    }

    function getContractAddressByHash(bytes32 _nameHash) external view returns (address) {
        return _addresses[_nameHash];
    }

    function getContractAddressByName(string calldata _name) external view returns (address) {
        return _addresses[keccak256(abi.encode(_name))];
    }
}

/// Verifies nothing; tests drive the outcome directly to exercise both branches.
contract MockFdcVerification {
    bool public paymentValid = true;
    bool public nonexistenceValid = true;

    function setPaymentValid(bool _v) external {
        paymentValid = _v;
    }

    function setNonexistenceValid(bool _v) external {
        nonexistenceValid = _v;
    }

    function verifyXRPPayment(IXRPPayment.Proof calldata) external view returns (bool) {
        return paymentValid;
    }

    function verifyXRPPaymentNonexistence(IXRPPaymentNonexistence.Proof calldata) external view returns (bool) {
        return nonexistenceValid;
    }
}

contract MockFtsoV2 {
    uint256 public priceE18 = 2.5e18; // XRP/USD
    uint64 public ts = 1;

    function setPrice(uint256 _priceE18) external {
        priceE18 = _priceE18;
    }

    function getFeedByIdInWei(bytes21) external view returns (uint256, uint64) {
        return (priceE18, ts);
    }
}

contract MockTeeExtensionRegistry {
    uint256 public constant FIRST_PUBLIC_EXTENSION_ID = 0x10000;

    mapping(uint256 => address) public senderOf;
    uint256 public nextId = FIRST_PUBLIC_EXTENSION_ID;

    bytes32 public lastOpType;
    bytes32 public lastOpCommand;
    bytes public lastMessage;
    uint256 public instructionCount;

    function registerExtension(address _sender) external returns (uint256 id) {
        id = nextId;
        senderOf[id] = _sender;
        nextId = id + 1;
    }

    function nextPublicExtensionId() external view returns (uint256) {
        return nextId;
    }

    function getTeeExtensionInstructionsSender(uint256 _extensionId) external view returns (address) {
        return senderOf[_extensionId];
    }

    function sendInstructions(address[] calldata, ITeeExtensionRegistry.TeeInstructionParams calldata _params)
        external
        payable
        returns (bytes32)
    {
        lastOpType = _params.opType;
        lastOpCommand = _params.opCommand;
        lastMessage = _params.message;
        instructionCount += 1;
        return keccak256(abi.encode(_params.opCommand, instructionCount));
    }
}

contract MockTeeMachineRegistry {
    address public tee = 0x00000000000000000000000000000000000000A1;

    function setTee(address _tee) external {
        tee = _tee;
    }

    function getRandomTeeIds(uint256, uint256 _count) external view returns (address[] memory ids) {
        ids = new address[](_count);
        for (uint256 i = 0; i < _count; ++i) {
            ids[i] = tee;
        }
    }
}
