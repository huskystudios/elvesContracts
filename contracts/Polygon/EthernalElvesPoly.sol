// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./ERC721.sol"; 
import "./../DataStructures.sol";
import "./../Interfaces.sol";
//import "hardhat/console.sol"; 

// We are the Ethernal. The Ethernal Elves         
// Written by 0xHusky & Beff Jezos. Everything is on-chain for all time to come.
// Version 2.0.0
// Release notes: Export Sentinel

contract PolyEthernalElves is PolyERC721 {

    function name() external pure returns (string memory) { return "Polygon Ethernal Elves"; }
    function symbol() external pure returns (string memory) { return "pELV"; }
       
    using DataStructures for DataStructures.ActionVariables;
    using DataStructures for DataStructures.Elf;
    using DataStructures for DataStructures.Token; 

    IElfMetaDataHandler elfmetaDataHandler;
        
    using ECDSA for bytes32;
    
//STATE   

    bool public isGameActive;
    bool public isTerminalOpen;
    bool private initialized;

    address operator;

   
    uint256 public INIT_SUPPLY; 
    uint256 public price;
    uint256 public MAX_LEVEL;
    uint256 public TIME_CONSTANT; 
    uint256 public REGEN_TIME; 
 
    bytes32 internal ketchup;
    
    mapping(uint256 => uint256) public sentinels; //memory slot for Elfs
    mapping(address => uint256) public bankBalances; //memory slot for bank balances
    mapping(uint256 => Camps) public camps; //memory slot for campaigns

    struct Camps {
                uint32 baseRewards; 
                uint32 creatureCount; 
                uint32 creatureHealth; 
                uint32 expPoints; 
                uint32 minLevel;
                uint32 campMaxLevel;
        }
    
   
    function initialize() public {
    
       require(!initialized, "Already initialized");
       admin                = msg.sender;   
       initialized          = true;
       operator             = 0xa2B877EC3234F50C33Ff7d0605F7591053d06E31; 
       elfmetaDataHandler   = IElfMetaDataHandler(0x3cF1630393BFd1D9fF52bD822fE88714FC81467E);

       camps[1] = Camps({baseRewards: 10, creatureCount: 1000, creatureHealth: 120,  expPoints:6,   minLevel:1, campMaxLevel:100});


       MAX_LEVEL = 100;
       TIME_CONSTANT = 1 hours; 
       REGEN_TIME = 300 hours; 

    }

    function setAddresses(address _inventory, address _operator)  public {
       onlyOwner();
       elfmetaDataHandler   = IElfMetaDataHandler(_inventory);
       operator             = _operator;
    }    
    
    

//EVENTS

    event Action(address indexed from, uint256 indexed action, uint256 indexed tokenId);         
    event BalanceChanged(address indexed owner, uint256 indexed amount, bool indexed subtract);
    event Campaigns(address indexed owner, uint256 amount, uint256 indexed campaign, uint256 sector, uint256 indexed tokenId);
    event CheckIn(address indexed from, uint256 timestamp, uint256 indexed tokenId, uint256 indexed sentinel);      
    event RenTransferOut(address indexed from, uint256 timestamp, uint256 indexed renAmount);   
    event LastKill(address indexed from); 
    event AddCamp(uint256 indexed id, uint256 baseRewards, uint256 creatureCount, uint256 creatureHealth, uint256 expPoints, uint256 minLevel);

       
//////////////EXPORT TO OTHER CHAINS/////////////////

function checkIn(uint256[] calldata ids, uint256 renAmount, address owner) public returns (bool) {
     
        onlyOperator();
        require(isTerminalOpen, "Terminal is closed");         
         uint256 travelers = ids.length;
         if (travelers > 0) {

                    for (uint256 index = 0; index < ids.length; index++) {  
                        _actions(ids[index], 0, owner, 0, 0, false, false, false, 0);
                        emit CheckIn(owner, block.timestamp, ids[index], sentinels[ids[index]]);
                        sentinels[ids[index]] = 0; //scramble their bwainz
                    }
                  
          }

            if (renAmount > 0) {
                        
                    if(bankBalances[owner] - renAmount >= 0) {                      
                        _setAccountBalance(owner, renAmount, true);
                        emit RenTransferOut(owner,block.timestamp,renAmount);
                    }
             }
    

}


/////////////////////////////////////////////////////////////////

//GAMEPLAY//


    function sendCampaign(uint256[] calldata ids, uint256 campaign_, uint256 sector_, bool rollWeapons_, bool rollItems_, bool useitem_, address owner) external {
                  
         onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, rollWeapons_, rollItems_, useitem_, 1);
          }
    }

/*NOTE Add in V2

    function bloodThirst(uint256[] calldata ids, uint256 campaign_, uint256 sector_) external {
          isPlayer();          

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, false, false, false, 2);
          }
    }

    function rampage(uint256[] calldata ids, uint256 campaign_, uint256 sector_) external {
          isPlayer();          

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, true, true, false, 3);
          }
    }

*/
    function passive(uint256[] calldata ids, address owner) external {
                  
        onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 3, owner, 0, 0, false, false, false, 0);
          }
    }

    function returnPassive(uint256[] calldata ids, address owner) external  {
               
         onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 4, owner, 0, 0, false, false, false, 0);
          }
    }

    function forging(uint256[] calldata ids, address owner) external payable {
              
         onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 5, owner, 0, 0, false, false, false, 0);
          }
    }

    function merchant(uint256[] calldata ids, address owner) external payable {
          
        onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 6, owner, 0, 0, false, false, false, 0);
          }

    }

    function heal(uint256 healer, uint256 target, address owner) external {
        onlyOperator();
        _actions(healer, 7, owner, target, 0, false, false, false, 0);
    }    



//INTERNALS
    
        function _mintElf(address _to) private returns (uint16 id) {
                  
            sentinels[id] = 0;
                
            _mint(_to, id);           

        }


        function _actions(
            uint256 id_, 
            uint action, 
            address elfOwner, 
            uint256 campaign_, 
            uint256 sector_, 
            bool rollWeapons, 
            bool rollItems, 
            bool useItem, 
            uint256 gameMode_) 
        
        private {

            DataStructures.Elf memory elf = DataStructures.getElf(sentinels[id_]);
            DataStructures.ActionVariables memory actions;
            require(isGameActive);
            require(elf.owner == elfOwner, "NotYourElf");

            uint256 rand = _rand();
                
                if(action == 0){//Unstake in Eth, Return to Eth in Polygon

                     if(elf.action == 3){
                     actions.timeDiff = (block.timestamp - elf.timestamp) / 1 days; //amount of time spent in camp CHANGE TO 1 DAYS!
                     elf.level = _exitPassive(actions.timeDiff, elf.level, elfOwner);
                    
                     }
                         

                }else if(action == 2){//campaign loop - bloodthirst and rampage mode loop.

                    require(elf.timestamp < block.timestamp, "elf busy");
                    require(elf.action != 3, "exit passive mode first");                 

                    (elf.level, actions.reward, elf.timestamp, elf.inventory) = _gameEngine(campaign_, sector_, elf.level, elf.attackPoints, elf.healthPoints, elf.inventory, useItem);
                    
                    uint256 options;
                    if(rollWeapons && rollItems){
                        options = 3;
                        }else if(rollWeapons){
                        options = 1;
                        }else if(rollItems){
                        options = 2;
                        }else{
                        options = 0;
                    }
                  
                    if(options > 0){
                       (elf.weaponTier, elf.primaryWeapon, elf.inventory) 

                                    = DataStructures.roll(id_, elf.level, _rand(), options, elf.weaponTier, elf.primaryWeapon, elf.inventory);                                    
                                    
                    }
                    
                    if(gameMode_ == 1 || gameMode_ == 2) _setAccountBalance(elfOwner, actions.reward, false);
                    if(gameMode_ == 3) elf.level = elf.level + 1;
                    
                    emit Campaigns(elfOwner, actions.reward, campaign_, sector_, id_);

                
                }else if(action == 3){//passive campaign

                    require(elf.timestamp < block.timestamp, "elf busy");
                    elf.timestamp = block.timestamp; //set timestamp to current block time

                }else if(action == 4){///return from passive mode
                    
                    require(elf.action == 3);                    

                    actions.timeDiff = (block.timestamp - elf.timestamp) / 1 days; //amount of time spent in camp CHANGE TO 1 DAYS!

                    elf.level = _exitPassive(actions.timeDiff, elf.level, elfOwner);
                   

                }else if(action == 5){//forge loop for weapons
                   
                    require(msg.value >= .01 ether);  
                    require(elf.action != 3); //Cant roll in passve mode  

                    (elf.primaryWeapon, elf.weaponTier) = _rollWeapon(elf.level, id_, rand);
   
                
                }else if(action == 6){//item or merchant loop
                   
                   // require(msg.value >= .01 ether); 
                    require(elf.action != 3); //Cant roll in passve mode
                    (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, rand, 2, elf.weaponTier, elf.primaryWeapon, elf.inventory);                      

                }else if(action == 7){//healing loop


                    require(elf.sentinelClass == 0, "not a healer"); 
                    require(elf.action != 3, "cant heal while passive"); //Cant heal in passve mode
                    require(elf.timestamp < block.timestamp, "elf busy");
                    
                    elf.timestamp = block.timestamp + (12 hours);

                    elf.level = elf.level + 1;
                    
                    {   

                        DataStructures.Elf memory hElf = DataStructures.getElf(sentinels[campaign_]);//using the campaign varialbe for elfId here.
                        require(hElf.owner == elfOwner, "NotYourElf");
                               
                                if(block.timestamp < hElf.timestamp){

                                        actions.timeDiff = hElf.timestamp - block.timestamp;
                
                                        actions.timeDiff = actions.timeDiff > 0 ? 
                                            
                                            hElf.sentinelClass == 0 ? 0 : 
                                            hElf.sentinelClass == 1 ? actions.timeDiff * 1/4 : 
                                            actions.timeDiff * 1/2
                                        
                                        : actions.timeDiff;
                                        
                                        hElf.timestamp = hElf.timestamp - actions.timeDiff;                        
                                        
                                }
                            
                        actions.traits = DataStructures.packAttributes(hElf.hair, hElf.race, hElf.accessories);
                        actions.class =  DataStructures.packAttributes(hElf.sentinelClass, hElf.weaponTier, hElf.inventory);
                                
                        sentinels[campaign_] = DataStructures._setElf(hElf.owner, hElf.timestamp, hElf.action, hElf.healthPoints, hElf.attackPoints, hElf.primaryWeapon, hElf.level, actions.traits, actions.class);

                }
                }
          
             
            actions.traits   = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
            actions.class    = DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
            elf.healthPoints = DataStructures.calcHealthPoints(elf.sentinelClass, elf.level); 
            elf.attackPoints = DataStructures.calcAttackPoints(elf.sentinelClass, elf.weaponTier);  
            elf.level        = elf.level > 100 ? 100 : elf.level; 
            elf.action       = action;

            sentinels[id_] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
            emit Action(msg.sender, action, id_); 
    }


function _gameEngine(uint256 _campId, uint256 _sector, uint256 _level, uint256 _attackPoints, uint256 _healthPoints, uint256 _inventory, bool _useItem) internal 
 
 returns(uint256 level, uint256 rewards, uint256 timestamp, uint256 inventory){
  
  Camps memory camp = camps[_campId];  
  
  require(camp.minLevel <= _level, "level too low");
  require(camp.campMaxLevel >= _level, "level too high"); //no level requirement for camp 1 -3
  require(camp.creatureCount > 0, "no creatures left");
  
  camps[_campId].creatureCount = camp.creatureCount - 1;

  rewards = camp.baseRewards + (2 * (_sector - 1));
  
  rewards = rewards * (1 ether);

  level = (uint256(camp.expPoints)/3); //convetrt xp to levels

  inventory = _inventory;
 
  if(_useItem){
         _attackPoints = _inventory == 1 ? _attackPoints * 2   : _attackPoints;
         _healthPoints = _inventory == 2 ? _healthPoints * 2   : _healthPoints; 
          rewards      = _inventory == 3 ?  rewards * 2        : rewards;
          level        = _inventory == 4 ?  level * 2          : level; //if inventory is 4, level reward is doubled
         _healthPoints = _inventory == 5 ? _healthPoints + 200 : _healthPoints; 
         _attackPoints = _inventory == 6 ? _attackPoints * 3   : _attackPoints;
         
         inventory = 0;
  }

  level = _level + level;  //add level to current level
  level = level < MAX_LEVEL ? level : MAX_LEVEL; //if level is greater than max level, set to max level
                             
  uint256 creatureHealth =  ((_sector - 1) * 12) + camp.creatureHealth; 
  uint256 attackTime = creatureHealth/_attackPoints;
  
  attackTime = attackTime > 0 ? attackTime * TIME_CONSTANT : 0;
  
  timestamp = REGEN_TIME/(_healthPoints) + (block.timestamp + attackTime);
  

}



    function _exitPassive(uint256 timeDiff, uint256 _level, address _owner) private returns (uint256 level) {
            
            uint256 rewards;

                    if(timeDiff >= 7){
                        rewards = 140 ether;
                    }
                    if(timeDiff >= 14 && timeDiff < 30){
                        rewards = 420 ether;
                    }
                    if(timeDiff >= 30){
                        rewards = 1200 ether;
                    }
                    
                    level = _level + (timeDiff * 1); //one level per day
                    
                    if(level >= 100){
                        level = 100;
                    }
                    
                   

                    _setAccountBalance(_owner, rewards, false);

    }


    function _rollWeapon(uint256 level, uint256 id, uint256 rand) internal pure returns (uint256 newWeapon, uint256 newWeaponTier) {
    
        uint256 levelTier = level == 100 ? 5 : uint256((level/20) + 1);
                
                uint256  chance = _randomize(rand, "Weapon", id) % 100;
      
                if(chance > 10 && chance < 80){
        
                             newWeaponTier = levelTier;
        
                        }else if (chance > 80 ){
        
                             newWeaponTier = levelTier + 1 > 4 ? 4 : levelTier + 1;
        
                        }else{

                                newWeaponTier = levelTier - 1 < 1 ? 1 : levelTier - 1;          
                        }
                         

                newWeapon = ((newWeaponTier - 1) * 3) + (rand % 3);  
            
        
    }
    

    function _setAccountBalance(address _owner, uint256 _amount, bool _subtract) private {
            
            _subtract ? bankBalances[_owner] -= _amount : bankBalances[_owner] += _amount;
            emit BalanceChanged(_owner, _amount, _subtract);
    }


    function _randomize(uint256 ran, string memory dom, uint256 ness) internal pure returns (uint256) {
    return uint256(keccak256(abi.encode(ran,dom,ness)));}

    function _rand() internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(msg.sender, block.difficulty, block.timestamp, block.basefee, ketchup)));}

//PUBLIC VIEWS
    function tokenURI(uint256 _id) external view returns(string memory) {
    return elfmetaDataHandler.getTokenURI(uint16(_id), sentinels[_id]);
    }

    function attributes(uint256 _id) external view returns(uint hair, uint race, uint accessories, uint sentinelClass, uint weaponTier, uint inventory){
    uint256 character = sentinels[_id];

    uint _traits =        uint256(uint8(character>>240));
    uint _class =         uint256(uint8(character>>248));

    hair           = (_traits / 100) % 10;
    race           = (_traits / 10) % 10;
    accessories    = (_traits) % 10;
    sentinelClass  = (_class / 100) % 10;
    weaponTier     = (_class / 10) % 10;
    inventory      = (_class) % 10; 

}

function getSentinel(uint256 _id) external view returns(uint256 sentinel){
    return sentinel = sentinels[_id];
}


function getToken(uint256 _id) external view returns(DataStructures.Token memory token){
   
    return DataStructures.getToken(sentinels[_id]);
}

function elves(uint256 _id) external view returns(address owner, uint timestamp, uint action, uint healthPoints, uint attackPoints, uint primaryWeapon, uint level) {

    uint256 character = sentinels[_id];

    owner =          address(uint160(uint256(character)));
    timestamp =      uint(uint40(character>>160));
    action =         uint(uint8(character>>200));
    healthPoints =   uint(uint8(character>>208));
    attackPoints =   uint(uint8(character>>216));
    primaryWeapon =  uint(uint8(character>>224));
    level =          uint(uint8(character>>232));   

}

//Modifiers but as functions. Less Gas
    function isPlayer() internal {    
        uint256 size = 0;
        address acc = msg.sender;
        assembly { size := extcodesize(acc)}
        require((msg.sender == tx.origin && size == 0));
        ketchup = keccak256(abi.encodePacked(acc, block.coinbase));
    }

    function onlyOperator() internal view {    
       require(msg.sender == operator);
    }

    function onlyOwner() internal view {    
        require(admin == msg.sender);
    }

    function modifyElfDNA(uint256[] calldata ids, uint256[] calldata sentinel) external {
        require (msg.sender == operator || admin == msg.sender, "not allowed");      
        
        for(uint i = 0; i < ids.length; i++){
            
            sentinels[ids[i]] = sentinel[i];

        }
        
        
    }



//ADMIN Only

function initMint(address to, uint256 start, uint256 end) external {
        
        onlyOwner();

        for (uint256 i = start; i < end; i++) {
            _mint( to, i);
        }
    }
    


function addCamp(uint256 id, uint16 baseRewards_, uint16 creatureCount_, uint16 expPoints_, uint16 creatureHealth_, uint16 minLevel_, uint16 maxLevel_) external      
    {
        onlyOwner();
        
        Camps memory newCamp = Camps({
            baseRewards:    baseRewards_, 
            creatureCount:  creatureCount_, 
            expPoints:      expPoints_,
            creatureHealth: creatureHealth_, 
            minLevel:       minLevel_,
            campMaxLevel:   maxLevel_
            });
        
        camps[id] = newCamp;
        
        emit AddCamp(id, baseRewards_, creatureCount_, expPoints_, creatureHealth_, minLevel_);
    }



    function flipActiveStatus() external {
        onlyOwner();
        isGameActive = !isGameActive;
    }


     function flipTerminal() external {
        onlyOwner();
        isTerminalOpen = !isTerminalOpen;
    }
    
    
   function setAccountBalance(address _owner, uint256 _amount) public {                
        onlyOperator();
        bankBalances[_owner] += _amount;
    }

    function setElfManually(uint id, uint8 _primaryWeapon, uint8 _weaponTier, uint8 _attackPoints, uint8 _healthPoints, uint8 _level, uint8 _inventory, uint8 _race, uint8 _class, uint8 _accessories) external {
        onlyOwner();
        DataStructures.Elf memory elf = DataStructures.getElf(sentinels[id]);
        DataStructures.ActionVariables memory actions;

        elf.owner           = elf.owner;
        elf.timestamp       = elf.timestamp;
        elf.action          = elf.action;
        elf.healthPoints    = _healthPoints;
        elf.attackPoints    = _attackPoints;
        elf.primaryWeapon   = _primaryWeapon;
        elf.level           = _level;
        elf.weaponTier      = _weaponTier;
        elf.inventory       = _inventory;
        elf.race            = _race;
        elf.sentinelClass   = _class;
        elf.accessories     = _accessories;

        actions.traits = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
        actions.class =  DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
                       
        sentinels[id] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
        
    }
    

}





