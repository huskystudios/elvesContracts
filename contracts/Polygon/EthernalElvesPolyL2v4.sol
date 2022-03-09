// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./ERC721.sol"; 
import "./../DataStructures.sol";
import "./../Interfaces.sol";

// We are the Ethernal. The Ethernal Elves         
// Written by 0xHusky & Beff Jezos. Everything is on-chain for all time to come.
// Version 4.0.0
// Release notes: Adding Rampage and new abilities based on accessories 

contract PolyEthernalElvesV4 is PolyERC721 {

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
   
    mapping(address => bool)    public auth;  
    mapping(bytes => uint16)  public usedRenSignatures;
    address polyValidator;
    
    //NewDataSlots from this deployment///
    mapping(uint256 => Rampages) public rampages; //memory slot for campaigns
    
    struct Rampages {

                uint16 probDown; 
                uint16 probSame; 
                uint16 propUp; 
                uint16 levelsGained; 
                uint16 minLevel;
                uint16 maxLevel;
                uint16 renCost;     
                uint16 count; 


        }
    
    struct GameVariables {
                
                uint256 healTime; 
                uint256 instantKillModifier;     
                uint256 rewardModifier;     
                uint256 attackPointModifier;     
                uint256 healthPointModifier;;     
                uint256 reward;
                uint256 timeDiff;
                uint256 traits; 
                uint256 class;  

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

    function setValidator(address _validator)  public {
       onlyOwner();
       polyValidator = _validator;
    }      
    


//EVENTS

    event Action(address indexed from, uint256 indexed action, uint256 indexed tokenId);         
    event BalanceChanged(address indexed owner, uint256 indexed amount, bool indexed subtract);
    event Campaigns(address indexed owner, uint256 amount, uint256 indexed campaign, uint256 sector, uint256 indexed tokenId);
    event CheckIn(address indexed from, uint256 timestamp, uint256 indexed tokenId, uint256 indexed sentinel);      
    event RenTransferOut(address indexed from, uint256 timestamp, uint256 indexed renAmount);   
    event LastKill(address indexed from); 
    event AddCamp(uint256 indexed id, uint256 baseRewards, uint256 creatureCount, uint256 creatureHealth, uint256 expPoints, uint256 minLevel);
    event BloodThirst(address indexed owner, uint256 indexed tokenId); 
    event ElfTransferedIn(uint256 indexed tokenId, uint256 sentinel); 
    event RenTransferedIn(address indexed from, uint256 renAmount); 
       

  function setAuth(address[] calldata adds_, bool status) public {
       onlyOwner();
       
        for (uint256 index = 0; index < adds_.length; index++) {
            auth[adds_[index]] = status;
        }
    }

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

 function checkOutRen(uint256[] calldata renAmounts, bytes[] memory renSignatures, uint256[] calldata timestamps, address[] calldata owners) public returns (bool) {
   
   onlyOperator();
    require(isTerminalOpen, "Terminal is closed"); 
    

        for(uint i = 0; i < owners.length; i++){
             require(usedRenSignatures[renSignatures[i]] == 0, "Signature already used");   
             require(_isSignedByValidator(encodeRenForSignature(renAmounts[i], owners[i], timestamps[i]),renSignatures[i]), "incorrect signature");
             usedRenSignatures[renSignatures[i]] = 1;
             
             bankBalances[owners[i]] += renAmounts[i];     
             emit RenTransferedIn(owners[i], renAmounts[i]);    
        }

            
       
    }
    


function encodeRenForSignature(uint256 renAmount, address owner, uint256 timestamp) public pure returns (bytes32) {
     return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", 
                keccak256(
                        abi.encodePacked(renAmount, owner, timestamp))
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
            return signer == polyValidator;
  
}


/////////////////////////////////////////////////////////////////

//GAMEPLAY//


    function sendCampaign(uint256[] calldata ids, uint256 campaign_, uint256 sector_, bool rollWeapons_, bool rollItems_, bool useitem_, address owner) external {
                  
         onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, owner, campaign_, sector_, rollWeapons_, rollItems_, useitem_, 1);
          }
    }


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

    function forging(uint256[] calldata ids, address owner) external {
              
         onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 5, owner, 0, 0, false, false, false, 0);
          }
    }

    function merchant(uint256[] calldata ids, address owner) external {
          
        onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 6, owner, 0, 0, false, false, false, 0);
          }

    }

    function heal(uint256 healer, uint256 target, address owner) external {
        onlyOperator();
        _actions(healer, 7, owner, target, 0, false, false, false, 0);
    }

     function healMany(uint256[] calldata healers, uint256[] calldata targets, address owner) external {
        onlyOperator();
        
        for (uint256 index = 0; index < healers.length; index++) {  
            _actions(healers[index], 7, owner, targets[index], 0, false, false, false, 0);
        }
    }

    
     function synergize(uint256[] calldata ids, address owner) external {
        onlyOperator();
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 9, owner, 0, 0, false, false, false, 0);
          }

    }

    
 function bloodThirst(uint256[] calldata ids, bool rollItems_, bool useitem_, address owner) external {
          onlyOperator();       

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 10, owner, 0, 0, false, rollItems_, useitem_, 2);
          }
    }
  
 function rampage(uint256[] calldata ids, uint256 campaign_, address owner) external {
          onlyOperator();       

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 11, owner, campaign_, 0, false, false,false, 0);
          }
    }     

///////Primary game loop//////////////////////

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
            GameVariables memory actions;
            require(isGameActive);
            require(elf.owner == elfOwner, "NotYourElf");
            
            //Set special abilities when we retrieve the elf so they can be used in the rest of the game loop.            
                    (elf.attackPoints, actions) = _getAbilities(elf.attackPoints, elf.accessories, actions);

            uint256 rand = _rand();
                
                if(action == 0){//Unstake in Eth, Return to Eth in Polygon
                    
                    require(elf.timestamp < block.timestamp, "elf busy");
                    
                     if(elf.action == 3){
                     actions.timeDiff = (block.timestamp - elf.timestamp) / 1 days; //amount of time spent in camp CHANGE TO 1 DAYS!
                     elf.level = _exitPassive(actions.timeDiff, elf.level, elfOwner);
                    
                     }
                         

                }else if(action == 2){//campaign loop 

                    require(elf.timestamp < block.timestamp, "elf busy");
                    require(elf.action != 3, "exit passive mode first");                   
                

                        (elf.level, actions.reward, elf.timestamp, elf.inventory) = _campaignsEngine(campaign_, sector_, elf.level, elf.attackPoints, elf.healthPoints, elf.inventory, useItem);

                        if(rollWeapons && rollItems){
                        (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, _rand(), 3, elf.weaponTier, elf.primaryWeapon, elf.inventory);  
                        }else if(rollWeapons){
                        (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, _rand(), 1, elf.weaponTier, elf.primaryWeapon, elf.inventory);  
                        }else if(rollItems){
                        (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, _rand(), 2, elf.weaponTier, elf.primaryWeapon, elf.inventory);  
                        }

                        emit Campaigns(elfOwner, actions.reward, campaign_, sector_, id_);                 

                     _setAccountBalance(elfOwner, actions.reward, false);
                 
                
                }else if(action == 3){//passive campaign

                    require(elf.timestamp < block.timestamp, "elf busy");
                    elf.timestamp = block.timestamp; //set timestamp to current block time

                }else if(action == 4){///return from passive mode
                    
                    require(elf.action == 3);                    

                    actions.timeDiff = (block.timestamp - elf.timestamp) / 1 days; //amount of time spent in camp CHANGE TO 1 DAYS!

                    elf.level = _exitPassive(actions.timeDiff, elf.level, elfOwner);
                   

                }else if(action == 5){//forge loop for weapons Note. CHANGE BEFORE LIVE
                   
                    require(bankBalances[elfOwner] >= 200 ether, "Not Enough Ren");
                    require(elf.action != 3); //Cant roll in passve mode  

                    _setAccountBalance(elfOwner, 200 ether, true);
                    (elf.primaryWeapon, elf.weaponTier) = _rollWeapon(elf.level, id_, rand);
   
                
                }else if(action == 6){//item or merchant loop
                   
                    require(bankBalances[elfOwner] >= 10 ether, "Not Enough Ren");
                    require(elf.action != 3); //Cant roll in passve mode
                    
                    _setAccountBalance(elfOwner, 10 ether, true);
                    (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, rand, 2, elf.weaponTier, elf.primaryWeapon, elf.inventory);                      

                }else if(action == 7){//healing loop


                    require(elf.sentinelClass == 0, "not a healer"); 
                    require(elf.action != 3, "cant heal while passive"); //Cant heal in passve mode
                    require(elf.timestamp < block.timestamp, "elf busy");
                    
                    elf.timestamp = block.timestamp + (actions.healTime);//change to healtime

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
                //Action 8 is move to polygon
                }else if(action == 9){//Re-roll cooldown

                    require(bankBalances[elfOwner] >= 5 ether, "Not Enough Ren");
                    require(elf.sentinelClass == 0, "not a healer"); 
                    require(elf.action != 3, "cant reroll while passive"); //Cant heal in passve mode
                    
                    _setAccountBalance(elfOwner, 5 ether, true);
                    elf.timestamp = _rollCooldown(elf.timestamp, id_, rand);

                }else if(action == 10){//Bloodthirst

                    require(elf.timestamp < block.timestamp, "elf busy");
                    require(elf.action != 3, "exit passive mode first");  

                       (elf.level, actions.reward, elf.timestamp, elf.inventory) = _bloodthirst(campaign_, sector_, elf.weaponTier, elf.level, elf.attackPoints, elf.healthPoints, elf.inventory, useItem);

                       if(rollItems){
                       
                        (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(id_, elf.level, _rand(), 2, elf.weaponTier, elf.primaryWeapon, elf.inventory);  
                       
                       }    

                        
                       if(elf.sentinelClass == 1){
                            
                                elf.timestamp = _instantKill(elf.timestamp, elf.weaponTier, elfOwner, id_, actions.instantKillModifier);
                
                       }
                

                       _setAccountBalance(elfOwner, actions.reward, false);                 
                    
                
                }else if(action == 11){//Rampage
                        require(elf.action != 3, "cant rampage while passive"); //Archer?
                        //in rampage you can get accessories or weapons.
                        (elf.weaponTier, elf.primaryWeapon, elf.accessories, elf.level) = _rampage(elf.sentinalClass, elf.level, elf.weaponTier, elf.primaryWeapon, elf.accessories, campaign_, id_);
                
                
                }        
             
            actions.traits   = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
            actions.class    = DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
            elf.healthPoints = DataStructures.calcHealthPoints(elf.sentinelClass, elf.level); 
            elf.attackPoints = DataStructures.calcAttackPoints(elf.sentinelClass, elf.weaponTier);  
            elf.level        = elf.level > 100 ? 100 : elf.level; 
            elf.action       = action;

            sentinels[id_] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
            emit Action(elfOwner, action, id_); 
    }


function _campaignsEngine(uint256 _campId, uint256 _sector, uint256 _level, uint256 _attackPoints, uint256 _healthPoints, uint256 _inventory, bool _useItem) internal
 
 returns(uint256 level, uint256 rewards, uint256 timestamp, uint256 inventory){
  
  Camps memory camp = camps[_campId];  
  
  require(camp.minLevel <= _level, "level too low");
  require(camp.campMaxLevel >= _level, "level too high"); 
  require(camp.creatureCount > 0, "no creatures left");
  
  camps[_campId].creatureCount = camp.creatureCount - 1;  

  level = (uint256(camp.expPoints)/3); //convetrt xp to levels

  rewards = camp.baseRewards + (2 * (_sector - 1));
  rewards = rewards * (1 ether);      

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

function _instantKill(uint256 timestamp, uint256 weaponTier, address elfOwner, uint256 id, uint256 instantKillModifier) internal returns(uint256 timestamp_){

  uint16  chance = uint16(_randomize(_rand(), "InstantKill", id)) % 100;
  uint256 killChance = weaponTier == 3 ? 10 : weaponTier == 4 ? 15 : weaponTier == 5 ? 20 : 0;
  
  //Increasing kill chance if the right accessory is equipped
  killChance = killChance + instantKillModifier;

    if(chance <= killChance){
        timestamp_ = block.timestamp + (4 hours);
        emit BloodThirst(elfOwner, id);
    }else{
        timestamp_ = timestamp;
    } 

 }

   
function _bloodthirst(uint256 _campId, uint256 _sector, uint256 weaponTier, uint256 _level, uint256 _attackPoints, uint256 _healthPoints, uint256 _inventory, bool _useItem) internal view
 
 returns(uint256 level, uint256 rewards, uint256 timestamp, uint256 inventory){
  
  rewards = weaponTier == 3 ? 80 ether : weaponTier == 4 ? 95 ether : weaponTier == 5 ? 110 ether : 0;  

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

  level = _level; //+ level;  No level bonus for bloodthirst
  level = level < MAX_LEVEL ? level : MAX_LEVEL; //if level is greater than max level, set to max level
                             
  uint256 creatureHealth =  400; 
  uint256 attackTime = creatureHealth/_attackPoints;
  
  attackTime = attackTime > 0 ? attackTime * TIME_CONSTANT : 0;
  
  timestamp = REGEN_TIME/(_healthPoints) + (block.timestamp + attackTime);

}

function _rampage(uint256 _campId, uint256 _id) internal view
 
 returns(uint256 level, uint256 rewards, uint256 timestamp, uint256 inventory){

  Rampages memory rampage = rampages[_campId];  

  require(rampage.minLevel <= _level, "level too low");
  require(rampage.maxLevel >= _level, "level too high"); 
  require(carampagemp.count > 0, "no rampage left");
  require(bankBalances[elfOwner] >= rampage.renCost ether, "Not Enough Ren");
  require(elf.action != 3, "cant rampage while passive"); //Cant heal in passve mode

  _setAccountBalance(elfOwner, rampage.renCost ether, true);


(elf.weaponTier, elf.primaryWeapon, elf.accessories, elf.level) = _rampage(elf.sentinalClass, elf.level, elf.weaponTier, elf.primaryWeapon, elf.accessories, campaign_, id_);
         
                   
                    
                   
      }

function _getAbilities(uint256 _attackPoints, uint256 _accesssories, GameVariables memory _actions) 
        private returns (uint256 attackPoints_, GameVariables memory actions_) {

 attackPoints_ = _attackPoints;
 actions_.healTime = 12 hours;
 actions_.instantKillModifier = 0;

 //load ability based on accessory
 // +40 AP for BEAR / LIGER
 // SINS 80% Instant Kill
 // +20 AP for RANGERS 4x AP


        //if Druid 
        if(_accesssories == 3){
            actions_.healTime = 9 hours;

        }else if(_accesssories == 10){
        //if Assassin 3
            actions_.instantKillModifier = 15;


        }else if(_accesssories == 11){
        //if Assassin 4
            actions_.instantKillModifier = 25;
              

        } else if(_accesssories == 17){
        //if Ranger 3 
            _attackPoints = _attackPoints * 115/100;


        }else if(_accesssories == 18){
        //if Ranger 4
            _attackPoints = _attackPoints * 125/100;
              

        }        
 
 

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
                         
                newWeaponTier = newWeaponTier > 3 ? 3 : newWeaponTier;

                newWeapon = ((newWeaponTier - 1) * 3) + (rand % 3);  
            
        
    }


    function _rollCooldown(uint256 _timestamp, uint256 id, uint256 rand) internal view returns (uint256 timestamp_) {

        uint16 chance = uint16 (_randomize(rand, "Cooldown", id) % 100); //percentage chance of re-rolling cooldown
        uint256 cooldownLeft = _timestamp - block.timestamp; //time left on cooldown
        timestamp_ = _timestamp; //initialize timestamp to old timestamp

            if(cooldownLeft > 0){
                    
                    if(chance > 10 && chance < 70){
                    
                        timestamp_ = block.timestamp + (cooldownLeft * 2/3);
                    
                    }else if (chance > 70 ){
                    
                        timestamp_ = timestamp_ + 5 minutes;
                    
                    }else{
                            
                        timestamp_ = block.timestamp + (cooldownLeft * 1/2);
                        
                        }
            }

        return timestamp_;    
                
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
       require(msg.sender == operator || auth[msg.sender] == true);

    }

    function onlyOwner() internal view {    
        require(admin == msg.sender);
    }

    function modifyElfDNA(uint256[] calldata ids, uint256[] calldata sentinel) external {
        require (msg.sender == operator || admin == msg.sender || auth[msg.sender] == true, "not allowed");      
        
        for(uint i = 0; i < ids.length; i++){
            
            sentinels[ids[i]] = sentinel[i];
            
            emit ElfTransferedIn(ids[i], sentinel[i]);

        }
        
        
    }

    function prismBridge(uint256[] calldata ids, uint256[] calldata sentinel) external {
        require (msg.sender == operator || admin == msg.sender || auth[msg.sender] == true, "not allowed");
        require(isTerminalOpen);
        
        for(uint i = 0; i < ids.length; i++){

            DataStructures.Elf memory elf = DataStructures.getElf(sentinels[ids[i]]);            
            require(elf.owner == address(0), "Already in Polygon");
            
            sentinels[ids[i]] = sentinel[i];
            
            emit ElfTransferedIn(ids[i], sentinel[i]);

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

    function setAccountBalances(address[] calldata _owners, uint256[] calldata _amounts) public {                
        onlyOperator();

          for(uint i = 0; i < _owners.length; i++){
            
           bankBalances[_owners[i]] += _amounts[i];     
 
           emit RenTransferedIn(_owners[i], _amounts[i]);                 

        }
       
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

    //Note: This function has been added to help someone who got scammed and lost his elves.     
    function changeElfOwner(address elfOwner, uint id) external {
        onlyOwner();
        DataStructures.Elf memory elf = DataStructures.getElf(sentinels[id]);
        DataStructures.ActionVariables memory actions;

        elf.owner           = elfOwner;
        elf.timestamp       = elf.timestamp;
        elf.action          = elf.action;
        elf.healthPoints    = elf.healthPoints;
        elf.attackPoints    = elf.attackPoints;
        elf.primaryWeapon   = elf.primaryWeapon;
        elf.level           = elf.level;
        elf.weaponTier      = elf.weaponTier;
        elf.inventory       = elf.inventory;
        elf.race            = elf.race;
        elf.sentinelClass   = elf.sentinelClass;
        elf.accessories     = elf.accessories;

        actions.traits = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
        actions.class =  DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
                       
        sentinels[id] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
        
    }
    

}