// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Interfaces.sol";
import "hardhat/console.sol";

contract OLDTerminus {

    address public bridge; ///FxChild /FXRoot
    address public elves;
    address public ren;

    mapping (address => address) public contractPairs;
    mapping (uint256 => address) public elfOwner;

    function initialize(address bridge_, address elves_, address ren_) external {

        bridge   = bridge_;
        elves    = elves_;
        ren      = ren_;
       
    }

    function setContractPairs(address key_, address pair_) external {
        
        contractPairs[key_] = pair_;
        contractPairs[pair_] = key_;

    }

    /// @dev Send Elves and Miren to Polygon

    function travel(uint256[] calldata ids, uint256 renAmount) external {
        address target = contractPairs[address(this)];

        uint256 travelers = ids.length;

        uint256 currIndex = 0;

        bytes[] memory calls = new bytes[]((travelers > 0 ? travelers + 1 : 0) + (renAmount > 0 ? 1 : 0));

        if (travelers > 0) {
            
            //stake all elves with terminus contract
            IElves(elves).pull(msg.sender, ids);

            // Get Elf metadata and package with function to recreate the elf in the opposite contract
            for (uint256 i = 0; i < ids.length; i++) {

                uint256 sentinel = IElves(elves).getSentinel(ids[i]);
                calls[i] = abi.encodeWithSelector(this.callElves.selector, abi.encodeWithSelector(IElves.modifyElfDNA.selector,ids[i], sentinel)); 

            }

            calls[travelers] = abi.encodeWithSelector(this.returnToOwner.selector,contractPairs[elves], msg.sender, ids);
            currIndex += travelers + 1;
        }

        if (renAmount > 0) {
            IERC20Lite(ren).burn(msg.sender, renAmount);
            calls[currIndex] = abi.encodeWithSelector(this.mintToken.selector, contractPairs[address(ren)], msg.sender, renAmount);
            currIndex++;
        }
        
        //send wrapped functions with instructions to the message sender
        ITunnel(bridge).sendMessage(abi.encode(target, calls)); 
    }

    function callElves(bytes calldata data) external {
        onlyBridge();

        (bool succ, ) = elves.call(data);
        require(succ);
    }

    event D(uint tt);
    event DAD(address al);

    function returnToOwner(address token, address owner, uint256[] calldata ids) external {


        emit DAD(token);

        for (uint256 i = 0; i < ids.length; i++) {  
            emit D(ids[i]);
            if (token == elves)  delete elfOwner[ids[i]];
            IERC721Lite(token).transfer(owner, ids[i]);
        }
    }

    function mintToken(address token, address to, uint256 amount) external { 
  

        IERC20Lite(token).mint(to, amount);
    }

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

    function onlyBridge() view internal {
        require(msg.sender == bridge, "not bridge");
    } 

}