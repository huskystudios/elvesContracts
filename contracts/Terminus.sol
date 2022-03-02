// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./DataStructures.sol";
import "./Interfaces.sol";
import "hardhat/console.sol"; 

// We are the Ethernal. The Ethernal Elves         
// Written by 0xHusky & Beff Jezos. Everything is on-chain for all time to come.
// Version 1.0.4
//patch notes: ICY Patch and Items Patch

contract ElvesTerminus {
    
    using ECDSA for bytes32;
    
//STATE   
    bool private initialized;
    bool public isTerminalOpen;
    
    
    address elves;//Elves Contract
    address admin;
    address validator;
    bytes32 internal ketchup;    
    
    mapping(uint256 => address) public reservations; //memory slot for exits through the terminal
    mapping (uint256 => address) public elfOwner;

    event CheckIn(address indexed from, uint256 timestamp, uint256 indexed tokenId, uint256 indexed sentinel);         
    event CheckOut(address indexed to, uint256 timestamp, uint256 indexed tokenId, uint256 indexed sentinel);         
    



   
       function initialize(address _elves) public {
    
       require(!initialized, "Already initialized");
       admin                = msg.sender;   
       elves                = _elves;
       validator            = 0x80861814a8775de20F9506CF41932E95f80f7035;
       isTerminalOpen       = true;
    }

  
    
 
//EVENTS

    
    event BalanceChanged(address indexed owner, uint256 indexed amount, bool indexed subtract);
    event Campaigns(address indexed owner, uint256 amount, uint256 indexed campaign, uint256 sector, uint256 indexed tokenId);
        
//MINT
//Whitelist permissions 

function encodeForSignature(uint256 id, address to, uint256 sentinel) private pure returns (bytes32) {
     return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", 
                keccak256(
                        abi.encodePacked(id, to, sentinel))
                        )
                    );
}       
  
function _isSignedByValidator(bytes32 _hash, bytes memory _signature) private view returns (bool) {
    
    bytes32 r;
    bytes32 s;
    uint8 v;
           assembly {
                r := mload(add(_signature, 0x20))
                s := mload(add(_signature, 0x40))
                v := byte(0, mload(add(_signature, 0x60)))
            }
        
            address signer = ecrecover(_hash, v, r, s);
            return signer == validator;
  
}



function validSignature(uint256 id, address to, uint256 sentinel, bytes memory signature) public view returns (bool) {
    
    return _isSignedByValidator(encodeForSignature(id, to, sentinel), signature);

}



//////////////////////////////////////



    function pullCallback(address owner, uint256[] calldata ids) external {
        require(msg.sender == elves);
        for (uint256 i = 0; i < ids.length; i++) {
            _stake(msg.sender, ids[i], owner);
        }
    }




function _stake(address token, uint256 id, address owner) internal {
        require(elfOwner[id] == address(0), "already staked");
        require(msg.sender == token, "not elf contract");
        require(IERC721Lite(token).ownerOf(id) == address(this), "elf not transferred");

        if (token == elves)   elfOwner[id]  = owner;
    
}


 function _checkOut(uint256 id_, uint256 _sentinel, bytes memory _signature) private returns (bool) {

    require(isTerminalOpen, "Terminal is closed");
    require(reservations[id_] == msg.sender, "You are not the owner of this exit");
    require(_isSignedByValidator(encodeForSignature(id_, msg.sender, _sentinel),_signature), "incorrect signature"); 
   
    address to = msg.sender;
    

    IElves(elves).modifyElfDNA(id_, _sentinel);

    uint256 timestamp = block.timestamp;

   IElves(elves).transfer(to, id_);
    
    reservations[id_] = address(0);//delete owner from exit

   
 
   emit CheckOut(to, timestamp, id_, _sentinel);

 }

/*
 
    function returnToOwner(address token, address owner, uint256[] calldata ids) external {


        emit DAD(token);

        for (uint256 i = 0; i < ids.length; i++) {  
            emit D(ids[i]);
            if (token == elves)  delete elfOwner[ids[i]];
            IERC721Lite(token).transfer(owner, ids[i]);
        }
    }

*/

 //Modifiers but as functions. Less Gas
    function isPlayer() internal {    
        uint256 size = 0;
        address acc = msg.sender;
        assembly { size := extcodesize(acc)}
        require((msg.sender == tx.origin && size == 0));
        ketchup = keccak256(abi.encodePacked(acc, block.coinbase));
    }


    function onlyOwner() internal view {    
        require(admin == msg.sender);
    }

 


}





