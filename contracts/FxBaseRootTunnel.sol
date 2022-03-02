// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {RLPReader} from "./lib/RLPReader.sol";
import {MerklePatriciaProof} from "./lib/MerklePatriciaProof.sol";
import {Merkle} from "./lib/Merkle.sol";
import "./lib/ExitPayloadReader.sol";

interface IFxStateSender {
    function sendMessageToChild(address _receiver, bytes calldata _data) external;
}

interface ICheckpointManager {
    function headerBlocks(uint256 headerBlock) external view returns (bytes32 root,uint256 start,uint256 end,uint256 createdAt,address proposer);
}

contract FxBaseRootTunnel {
    using RLPReader for RLPReader.RLPItem;
    using Merkle for bytes32;
    using ExitPayloadReader for bytes;
    using ExitPayloadReader for ExitPayloadReader.ExitPayload;
    using ExitPayloadReader for ExitPayloadReader.Log;
    using ExitPayloadReader for ExitPayloadReader.LogTopics;
    using ExitPayloadReader for ExitPayloadReader.Receipt;

    // keccak256(MessageSent(bytes))
    bytes32 public constant SEND_MESSAGE_EVENT_SIG = 0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036;

    // state sender contract
    IFxStateSender public fxRoot;
    // root chain manager
    ICheckpointManager public checkpointManager;
    
    // child tunnel contract which receives and sends messages
    address public fxChildTunnel; ///POINT TO POLYGON CHILD TUNNEL CONTRACT
    // storage to avoid duplicate exits
    mapping(bytes32 => bool) public processedExits;

    address public admin;
    mapping(address => bool) public auth; //set allowed users

    event CallMade(address target, bool success, bytes data);

    function initialize(address fxRoot_, address checkpointManager_) external {
        // Just for testnets, on mainnet the admin is already set
        admin = msg.sender;

        fxRoot            = IFxStateSender(fxRoot_);
        checkpointManager = ICheckpointManager(checkpointManager_);        

    }

    function setAuth(address[] calldata adds_, bool status) external {
        require(msg.sender == admin, "not admin");
        for (uint256 index = 0; index < adds_.length; index++) {
            auth[adds_[index]] = status;
        }
    }

    // set fxChildTunnel if not set already
    function setFxChildTunnel(address _fxChildTunnel) public {
        require(fxChildTunnel == address(0x0), "FxBaseRootTunnel: CHILD_TUNNEL_ALREADY_SET");
        fxChildTunnel = _fxChildTunnel;
    }
    
    /**
     * @notice Send bytes message to Child Tunnel
     * @param message_ bytes message that will be sent to Child Tunnel
     * some message examples -
     *   abi.encode(tokenId);
     *   abi.encode(tokenId, tokenMetadata);
     *   abi.encode(messageType, messageData);
     */

    function sendMessage(bytes calldata message_) external {
        require(auth[msg.sender], "not authorized to use portal");

        fxRoot.sendMessageToChild(fxChildTunnel, message_);
    }

     function replayCall(address target, bytes memory data, bool reqSuccess) external {
        require(msg.sender == admin, "not allowed");
        (bool succ, ) = target.call(data);
        if (reqSuccess) require(succ, "call failed");
    }

    /// @dev executed when we receive a message from Polygon
    function _processMessageFromChild(bytes memory data) internal {
        (address target, bytes[] memory calls ) = abi.decode(data, (address, bytes[]));
        for (uint256 i = 0; i < calls.length; i++) {
            (bool succ, ) = target.call(calls[i]);
            emit CallMade(target, succ, calls[i]);
        }
    }

    function _validateAndExtractMessage(bytes memory inputData) internal returns (bytes memory) {
        ExitPayloadReader.ExitPayload memory payload = inputData.toExitPayload();

        bytes memory branchMaskBytes = payload.getBranchMaskAsBytes();
        uint256 blockNumber = payload.getBlockNumber();
        // checking if exit has already been processed
        // unique exit is identified using hash of (blockNumber, branchMask, receiptLogIndex)
        bytes32 exitHash = keccak256(
            abi.encodePacked(
                blockNumber,
                // first 2 nibbles are dropped while generating nibble array
                // this allows branch masks that are valid but bypass exitHash check (changing first 2 nibbles only)
                // so converting to nibble array and then hashing it
                MerklePatriciaProof._getNibbleArray(branchMaskBytes),
                payload.getReceiptLogIndex()
            )
        );
        require(processedExits[exitHash] == false, "FxRootTunnel: EXIT_ALREADY_PROCESSED");
        processedExits[exitHash] = true;

        ExitPayloadReader.Receipt memory receipt = payload.getReceipt();
        ExitPayloadReader.Log memory log = receipt.getLog();

        // check child tunnel
        require(fxChildTunnel == log.getEmitter(), "FxRootTunnel: INVALID_FX_CHILD_TUNNEL");

        bytes32 receiptRoot = payload.getReceiptRoot();
        // verify receipt inclusion
        require(
            MerklePatriciaProof.verify(receipt.toBytes(), branchMaskBytes, payload.getReceiptProof(), receiptRoot),
            "FxRootTunnel: INVALID_RECEIPT_PROOF"
        );

        // verify checkpoint inclusion
        _checkBlockMembershipInCheckpoint(
            blockNumber,
            payload.getBlockTime(),
            payload.getTxRoot(),
            receiptRoot,
            payload.getHeaderNumber(),
            payload.getBlockProof()
        );

        ExitPayloadReader.LogTopics memory topics = log.getTopics();

        require(
            bytes32(topics.getField(0).toUint()) == SEND_MESSAGE_EVENT_SIG, // topic0 is event sig
            "FxRootTunnel: INVALID_SIGNATURE"
        );

        // received message data
        bytes memory message = abi.decode(log.getData(), (bytes)); // event decodes params again, so decoding bytes to get message
        return message;
    }

    function _checkBlockMembershipInCheckpoint(
        uint256 blockNumber,
        uint256 blockTime,
        bytes32 txRoot,
        bytes32 receiptRoot,
        uint256 headerNumber,
        bytes memory blockProof
    ) private view returns (uint256) {
        (bytes32 headerRoot, uint256 startBlock, , uint256 createdAt, ) = checkpointManager.headerBlocks(headerNumber);

        require(
            keccak256(abi.encodePacked(blockNumber, blockTime, txRoot, receiptRoot)).checkMembership(
                blockNumber - startBlock,
                headerRoot,
                blockProof
            ),
            "FxRootTunnel: INVALID_HEADER"
        );
        return createdAt;
    }

    /**
     * @notice receive message from  L2 to L1, validated by proof
     * @dev This function verifies if the transaction actually happened on child chain
     *
     * @param inputData RLP encoded data of the reference tx containing following list of fields
     *  0 - headerNumber - Checkpoint header block number containing the reference tx
     *  1 - blockProof - Proof that the block header (in the child chain) is a leaf in the submitted merkle root
     *  2 - blockNumber - Block number containing the reference tx on child chain
     *  3 - blockTime - Reference tx block time
     *  4 - txRoot - Transactions root of block
     *  5 - receiptRoot - Receipts root of block
     *  6 - receipt - Receipt of the reference transaction
     *  7 - receiptProof - Merkle proof of the reference receipt
     *  8 - branchMask - 32 bits denoting the path of receipt in merkle tree
     *  9 - receiptLogIndex - Log Index to read from the receipt
     */
    function receiveMessage(bytes memory inputData) public virtual {
        bytes memory message = _validateAndExtractMessage(inputData);
        _processMessageFromChild(message);
    }
   
}
