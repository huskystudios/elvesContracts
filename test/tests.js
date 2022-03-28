const fs = require('fs-extra')
const path = require('path')

const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const {initEthers, assertThrowsMessage, signPackedData, getTimestamp, increaseBlockTimestampBy} = require('./helpers')


const increaseWorldTimeinSeconds = async (seconds, mine = false) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  if (mine) {
    await ethers.provider.send("evm_mine", []);
  }
};

const mintPrice = ".088"


describe("Ethernal Elves Contracts", function () {
  let owner;
  let beff;
  let addr3;
  let addr4;
  let addr5;
  let addrs;
  let ren
  let elves
  let inventory
  let campaigns
  let terminus
  let fxBaseRootTunnel
  let artifacts


  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  // Deploy each contract and Initialize main contract with varialbes 
    
  [owner, beff, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();
  
  //owner and beff are dev wallets. addr3 and addr4 will be used to test the game and transfer/banking functions
  
  const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandlerV2");
  const Miren = await ethers.getContractFactory("Miren");
  //const Elves = await ethers.getContractFactory("EthernalElves");
  const Elves = await ethers.getContractFactory("EthernalElvesV4");
  const Pelves = await ethers.getContractFactory("EETest");
  const Campaigns = await ethers.getContractFactory("ElfCampaignsV3");
  const Terminus = await ethers.getContractFactory("ElvesTerminus");
  const Artifacts = await ethers.getContractFactory("ElvesArtifacts");
  //const Bridge = await ethers.getContractFactory("FxBaseRootTunnel");

  ///Deploy art contracts
  const Hair = await ethers.getContractFactory("Hair");
  const Race1 = await ethers.getContractFactory("Race1");
  const Race2 = await ethers.getContractFactory("Race2");
  const Weapons1 = await ethers.getContractFactory("Weapons1");
  const Weapons2 = await ethers.getContractFactory("Weapons2");
  const Weapons3 = await ethers.getContractFactory("Weapons3");
  const Weapons4 = await ethers.getContractFactory("Weapons4");
  const Weapons5 = await ethers.getContractFactory("Weapons5");
  const Weapons6 = await ethers.getContractFactory("Weapons6");
  const Accessories = await ethers.getContractFactory("Accessories1");
  const Accessories3 = await ethers.getContractFactory("Accessories3");
  const Accessories4 = await ethers.getContractFactory("Accessories4"); 
  const Accessories5 = await ethers.getContractFactory("Accessories5"); //THIS IS NOT FINAL

  const hair = await Hair.deploy();
  const race1 = await Race1.deploy();
  const race2 = await Race2.deploy();
  const weapons1 = await Weapons1.deploy();
  const weapons2 = await Weapons2.deploy();
  const weapons3 = await Weapons3.deploy();
  const weapons4 = await Weapons4.deploy();
  const weapons5 = await Weapons5.deploy();
  const weapons6 = await Weapons6.deploy();
  const accessories = await Accessories.deploy();
  const accessories3 = await Accessories3.deploy();
  const accessories4 = await Accessories4.deploy();
  const accessories5 = await Accessories5.deploy();
  
  ///Body x 3, Hair x 3, Weapons x 3, 
  
 //Deploying the contracts
  ren = await Miren.deploy(); 
   //whitelist = await Whitelist.deploy();
  
  artifacts = await Artifacts.deploy();
  

  //fxBaseRootTunnel = await Bridge.deploy();

  //fxBaseRootTunnel.initialize(terminus.address,terminus.address)
  //fxBaseRootTunnel.setAuth([terminus.address], true)
  
  //FOR ETH
  //elves = await upgrades.deployProxy(Elves, [owner.address, beff.address]);
  //FOR POLY
  elves = await upgrades.deployProxy(Pelves);  
  
  inventory = await upgrades.deployProxy(MetadataHandler);

  await elves.deployed();
  campaigns = await upgrades.deployProxy(Campaigns, [elves.address]);
  await campaigns.deployed();
  await campaigns.newCamps();

  await elves.setAddresses(inventory.address, "0x80861814a8775de20F9506CF41932E95f80f7035");

  //await elves.initializeRampage()

  
  //await elves.setAddresses(ren.address, inventory.address, campaigns.address, "0x80861814a8775de20F9506CF41932E95f80f7035");
  //await elves.setTerminus(terminus.address);

  await inventory.setRace([1,10,11,12,2,3], race1.address)
  await inventory.setRace([4,5,6,7,8,9], race2.address)
  
  await inventory.setHair([1,2,3,4,5,6,7,8,9], hair.address)

  await inventory.setWeapons([1,10,11,12,13,14,15], weapons1.address)
  await inventory.setWeapons([23,24,25,26,27,28,29], weapons2.address)
  await inventory.setWeapons([38,39,4,40,41,42], weapons3.address)
  await inventory.setWeapons([16,17,18,19,2,20,21,22], weapons4.address)  
  await inventory.setWeapons([3,30,31,32,33,34,35,36,37], weapons5.address)
  await inventory.setWeapons([43,44,45,5,6,7,8,9, 69], weapons6.address)

  await inventory.setAccessories([15,16,4,5,8,9,1,2,3,6,7,10,11,12,13,14,17,18,19,20,21], accessories.address)
  await inventory.setAccessories([2,3], accessories3.address)
  await inventory.setAccessories([10,11,17,18], accessories4.address)  
  await inventory.setAccessories([6,13,20], accessories5.address)
   
//  await campaigns.initialize(elves.address);

  //await terminus.initialize(fxBaseRootTunnel.address, elves.address, ren.address);
 
  await ren.setMinter(elves.address, 1)
  await ren.setMinter(owner.address, 1)
 //await ren.setMinter(terminus.address, 1)

  //await elves.flipWhitelist();
  //await elves.flipMint();
  await elves.flipActiveStatus();
  await elves.flipTerminal();
  await elves.setAuth([owner.address, addr3.address], true);



  //terminus = await Terminus.deploy();
  //terminus.initialize(elves.address)

  //elves.setTerminus(terminus.address)
  
  

  });


  

  describe("New Features", function () {
    it("Rampage tests", async function () {

      let level = 77
      let sentineClass = 1
      let race = 0
      let axa = 2
      let item = 3
      let weapon = 1
      let weaponTier = 3
      //elves.connect(addr3).forging([1],{ value: ethers.utils.parseEther(".01")});//fail
      //elves.connect(addr3).forging([1],{ value: ethers.utils.parseEther("0.0")});    
      
      //function mint(uint8 _level, uint8 _accessories, uint8 _race, uint8 _class) public returns (uint16 id) {
                            
      await elves.addRampage(4,5,30,65, 0, 1, 100,0,100)

        await elves.connect(addr3).mint(level,axa,race,sentineClass, item, weapon, weaponTier);
        await elves.connect(addr3).mint(level,axa,race,0, item, weapon, weaponTier);
        let takeMoney = "100000000000000000000000"
        await elves.setAccountBalance(addr3.address, takeMoney)

      //  function rampage(uint256[] calldata ids, uint256 campaign_, bool tryWeapon_, bool tryAccessories_, bool useitem_, address owner) external {

       // console.log(await elves.attributes(1))
       // console.log(await elves.elves(1))
       let tryAxa = true
       let useItem = true
       let tryWeapon = true
       let rampage = 4

       increaseWorldTimeinSeconds(36* 24 * 60 * 60, true)
       await elves.rampage([1],rampage,tryWeapon, tryAxa, useItem,addr3.address);
       
       
       
       //await elves.bloodThirst([1], tryAxa, useItem,addr3.address);
       //await elves.heal([2],[1],addr3.address);

       //1. NO DICE WT TOO LOW
       //WT3 no ability
      
      
      /* increaseWorldTimeinSeconds(36* 24 * 60 * 60, true)
       await elves.rampage([1],rampage,tryWeapon, tryAxa, useItem,addr3.address);
       increaseWorldTimeinSeconds(36* 24 * 60 * 60, true)
       await elves.rampage([1],rampage,tryWeapon, tryAxa, useItem,addr3.address);
       increaseWorldTimeinSeconds(36* 24 * 60 * 60, true)
       await elves.rampage([1],rampage,tryWeapon, tryAxa, useItem,addr3.address);

*/
     //   console.log(await elves.elves(1))


    //  await elves.setElfManually(1,1,weaponTier,1,1,level,1,1,1,0)

     // await elves.connect(addr3).forging([1], {value: ethers.utils.parseEther("0.04")})

 //     console.log(await elves.attributes(1))
 //     console.log(await elves.elves(1))
 //     console.log(await elves.rampages(rampage))
 //     console.log(await elves.bankBalances(addr3.address))

     // console.log(await elves.tokenURI(1))

      
     


      //check out

   //   let sentinelDNA = "45427413644928360261459227712385514627098612091526571146141633128741054971904"
// console.log(await elves.getSentinel(2))
   //   await elves.connect(addr3).checkOut(1, sentinelDNA)


    })

    it("Inventory tests", async function () {

      let level = 77
      let sentineClass = 2
      let race = 0
      let axa = 2
      let item = 2
      let weapon = 1
      let weaponTier = 5
     
      
      //function mint(uint8 _level, uint8 _accessories, uint8 _race, uint8 _class) public returns (uint16 id) {
                            
     

        await elves.connect(addr3).mint(level,axa,race,sentineClass, item, weapon, weaponTier);
        await elves.connect(addr3).mint(level,axa,race,0, item, weapon, weaponTier);
        let takeMoney = "100000000000000000000000"
        await elves.setAccountBalance(addr3.address, takeMoney)

      

       for(let i =0; i<2; i++){
       
        await elves.connect(addr3).merchant([1], addr3.address);
        //increaseWorldTimeinSeconds(100, true)
        //await elves.connect(addr3).bloodThirst([1], true, false, addr3.address)
        increaseWorldTimeinSeconds(10000000, true)
        //await elves.rampage([1],rampage,tryWeapon, tryAxa, useItem,addr3.address);
       
       }
      
       //elves.connect(addr3).forging([1],{ value: ethers.utils.parseEther("0.0")});    
     

       

    })

    it("Trade Items tests", async function () {

      elves.addPawnItem(1,10,15,10,9)
      elves.addPawnItem(2,20,25,10,3)
      elves.addPawnItem(3,30,35,10,3)
      elves.addPawnItem(4,40,45,10,0)
      elves.addPawnItem(5,50,55,10,5)

      let level = 77
      let sentineClass = 1
      let race = 0
      let axa = 2
      let item = 1
      let weapon = 1
      let weaponTier = 3

      await elves.connect(addr3).mint(level,axa,race,sentineClass, item, weapon, weaponTier);
     
      //elves.tradeItem(uint8 inventory, uint id, uint tradeAction, address elfOwner) external {
      
      
      
      //function mint(uint8 _level, uint8 _accessories, uint8 _race, uint8 _class) public returns (uint16 id) {
                            
     

        //await elves.connect(addr3).mint(level,axa,race,sentineClass, item, weapon, weaponTier);
       // await elves.connect(addr3).mint(level,axa,race,0, 6, weapon, weaponTier);
        let takeMoney = "100000000000000000000000"
        await elves.setAccountBalance(addr3.address, takeMoney)

        //sell item 2
        await elves.connect(addr3).sellItem(1, addr3.address) 

        await elves.connect(addr3).buyItem(1,5, addr3.address) 
    

        console.log(await elves.pawnItems(1))
        console.log(await elves.pawnItems(2))
        console.log(await elves.pawnItems(3))
        console.log(await elves.pawnItems(4))
        console.log(await elves.pawnItems(5))
      

 
      
       //elves.connect(addr3).forging([1],{ value: ethers.utils.parseEther("0.0")});    
     

       

    })
    it("Mint Artifacts", async function () {

     await artifacts.mint(10);
      let response = await artifacts.tokenURI(1);

      console.log(response)

       

    })



  });





 /* describe("Check In, Check Out", function () {
    it("Stake Sentinels with Contract", async function () {

      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});

      await ren.mint(addr3.address, ethers.BigNumber.from("90000000000000000000000")); 

      console.log(await elves.ownerOf(1))
    

      await elves.connect(addr3).checkIn([1,2,3], "90000000000000000000000");

       console.log(await elves.ownerOf(1))


      //check out

   //   let sentinelDNA = "45427413644928360261459227712385514627098612091526571146141633128741054971904"
// console.log(await elves.getSentinel(2))
   //   await elves.connect(addr3).checkOut(1, sentinelDNA)


    })

  });

  */

 /*  describe("Test Re-roll", function () {
      it("Reroll probabailities", async function () {

      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});


      await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr5).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr5).mint({ value: ethers.utils.parseEther(mintPrice)});

      await elves.connect(addr3).merchant([1], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([2], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([3], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([4], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([5], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([6], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([7], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([8], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([9], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([10], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([11], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([12], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([13], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([14], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([15], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([16], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([17], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([18], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([19], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).merchant([20], {value: ethers.utils.parseEther("0.01")})
      increaseWorldTimeinSeconds(10000000,true);
      await elves.connect(addr4).merchant([21], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr4).merchant([22], {value: ethers.utils.parseEther("0.01")})
      increaseWorldTimeinSeconds(10000000,true);
      await elves.connect(addr5).merchant([23], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr5).merchant([24], {value: ethers.utils.parseEther("0.01")})
      //increaseWorldTimeinSeconds(10000000,true);
      
      
      console.log(await elves.tokenURI(1))



    });});


*/
 
/*
    describe("Test Levels", function () {
      it("Testing correct item leveling", async function () {

      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});

      await elves.setElfManually(1,1,1,6,12,10,4,2,2,2)

      await elves.connect(addr3).sendCampaign([1],1,5,1,1,1);

      await elves.connect(addr3).sendCampaign([2],1,1,1,1,1);

      //10 + (3 * 2) = 16
      console.log("LEVELLLLS")
      console.log("level 16", await elves.elves(1))
      console.log("level 4", await elves.elves(2))


      console.log("After Campai4gn:");
      //await elves.connect(addr3).heal(3,4)
     

      //await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(10000000,true);
      await elves.connect(addr3).sendCampaign([3],1,1,1,1,1);
      console.log("level 5", await elves.elves(3))
      increaseWorldTimeinSeconds(10000000,true);
      await elves.connect(addr3).sendCampaign([3],1,1,1,1,1);
      console.log("level 8", await elves.elves(3))


    });});
*/


 
/*
  describe("Whitelist Mint", function () {
    it("WL Mint Qty 2", async function () {
    

      let sig3 = "0xdc32af9449379cbe2590d10906a4d75a54068b567d1bc7e5e513e60c560805944c850fd88b42e23415a939e18c85c39c4026faa2642d185b282e3cf1d88c666c1b"
      let sig4 = "0x839627587bd83e3c53f33a3d9ee73568c5120f65ab17359815a7b0cd40d61be00ad95184ca00101af08fcfa88e1802533980bae3f151166f794c95e5bccf1d061b"
      let sig5 = "0x20868c80932018ff173bb5eca6628b8071c0664e547cebcf040eab374a525af22ee2669a8afb218e1c56709ac4058898f82298e3a83b10a0e5454e6b6fa4bc3d1c" 

      console.log("Is Signature valid?", await elves.validSignature(addr3.address,0, sig3))

      await elves.connect(addr3).whitelistMint(2,addr3.address, 0, sig3, { value: ethers.utils.parseEther("0.00")})
      await elves.connect(addr4).whitelistMint(2,addr4.address, 1, sig4, { value: ethers.utils.parseEther("0.088")})
      await elves.connect(addr5).whitelistMint(2,addr5.address, 2, sig5, { value: ethers.utils.parseEther("0.176")})
    
      });
    it("WL Mint Qty 1", async function () {
    

        let sig3 = "0xdc32af9449379cbe2590d10906a4d75a54068b567d1bc7e5e513e60c560805944c850fd88b42e23415a939e18c85c39c4026faa2642d185b282e3cf1d88c666c1b"
        let sig4 = "0x839627587bd83e3c53f33a3d9ee73568c5120f65ab17359815a7b0cd40d61be00ad95184ca00101af08fcfa88e1802533980bae3f151166f794c95e5bccf1d061b"
        let sig5 = "0x20868c80932018ff173bb5eca6628b8071c0664e547cebcf040eab374a525af22ee2669a8afb218e1c56709ac4058898f82298e3a83b10a0e5454e6b6fa4bc3d1c" 
  
        await elves.connect(addr3).whitelistMint(1,addr3.address, 0, sig3, { value: ethers.utils.parseEther("0.00")})
        await elves.connect(addr4).whitelistMint(1,addr4.address, 1, sig4, { value: ethers.utils.parseEther("0.044")})
        await elves.connect(addr5).whitelistMint(1,addr5.address, 2, sig5, { value: ethers.utils.parseEther("0.088")})
      
        });
    it("Withdraw funds from player credit account to player wallet", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("1000000000000000000000"));
      await elves.connect(addr3).withdrawTokenBalance();
  
    expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });

    });  

*/


  describe("Deployment and ERC20 and ERC721 Minting", function () {
    it("Check contract deployer is owner", async function () {
      expect(await elves.admin()).to.equal(owner.address); 
    })
 /*   it("Mint entire NFT collection", async function () {

      await ren.mint(beff.address,  ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr3.address, ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr4.address, ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr5.address, ethers.BigNumber.from("6000000000000000000000")); 

      await elves.setAccountBalance(beff.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr4.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr5.address, ethers.BigNumber.from("100000000000000000000"));
      
      let totalsupply = 1
      let maxSupply = 12//parseInt(await elves.maxSupply())
      await elves.setInitialSupply(2)
      let initialSupply = parseInt(await elves.INIT_SUPPLY())
      let i = 1

      console.log("Actual Max Mint", parseInt(await elves.maxSupply()))
      
      while (totalsupply < maxSupply) {
        
          totalsupply<=initialSupply ? await elves.connect(beff).mint({ value: ethers.utils.parseEther(mintPrice)}) :   await elves.connect(beff).mint();
          console.log(i)
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr3).mint(); 
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr4).mint();
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr5).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr5).mint();
          elves.tokenURI(i)
          i++;
          console.log(i)
          
        totalsupply = parseInt(await elves.totalSupply())
        
        increaseWorldTimeinSeconds(1,true);
        
    
      }
     
      expect(parseInt(await elves.totalSupply())).to.equal(maxSupply);
    })*/   

        
  })

  /*

describe("Game Play", function () {

  it("Test passive mode unstake function and withdraw of some ren", async function () {
         
    await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
   
    await elves.connect(addr3).passive([1])
    increaseWorldTimeinSeconds(1304801,true);
    await elves.connect(addr3).unStake([1])
    console.log("Bank Bal afeter 7 day passive", await elves.bankBalances(addr3.address))
    await elves.connect(addr3).withdrawSomeTokenBalance("130000000000000000000")
    console.log("Bank Bal partial withdraw", await elves.bankBalances(addr3.address))
    await elves.connect(addr3).passive([1])
    increaseWorldTimeinSeconds(604801,true);
    await elves.connect(addr3).returnPassive([1]);
    console.log("Bank Bal afeter 7 day passive - withdraw", await elves.bankBalances(addr3.address))
    console.log("Levels:", await elves.elves(1))
     // expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("150000000000000000000").value);
      });


    it("Tests staking and actions", async function () {
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
     

      increaseWorldTimeinSeconds(10,true);


      await elves.connect(addr3).sendCampaign([1],1,4,0,1,0);
      console.log (await elves.attributes(1))
      increaseWorldTimeinSeconds(100000,true);
      console.log("FAIL")
//      await elves.connect(addr3).sendCampaign([1],1,4,0,1,0);
      increaseWorldTimeinSeconds(100000,true);
      console.log (await elves.attributes(1))
      await elves.connect(addr3).sendCampaign([4],1,5,1,1,2);

      increaseWorldTimeinSeconds(100000,true);
     
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      console.log("After Campaig1n:");
      await elves.connect(addr3).passive([3])
      increaseWorldTimeinSeconds(100000,true);
      await elves.connect(addr3).unStake([3])



      console.log("After Campaig2n:");
      //await elves.connect(addr3).returnPassive([3]);
      await elves.connect(addr3).forging([4], {value: ethers.utils.parseEther("0.04")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([4], {value: ethers.utils.parseEther("0.04")})
      await elves.connect(addr3).forging([5], {value: ethers.utils.parseEther("0.04")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([5], {value: ethers.utils.parseEther("0.04")})
      await elves.connect(addr3).forging([6], {value: ethers.utils.parseEther("0.04")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([6], {value: ethers.utils.parseEther("0.04")})

      console.log("After Campai4gn:");
     // await elves.connect(addr3).heal(3,4)
      //await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campa5ign:");
      //await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campai6gn:");
      //await elves.connect(addr3).rampage([5],1,1)

      

      // await elves.connect(addr3).unStake([1])
      increaseWorldTimeinSeconds(100000,true);
      await elves.connect(addr3).passive([6])
      
      //await elves.connect(addr3).test(2)

      console.log("Creatures left in camps", await campaigns.camps(1))
      
      elves.tokenURI(1)
      elves.tokenURI(2)
      elves.tokenURI(3)
      elves.tokenURI(4)
      elves.tokenURI(5)
      elves.tokenURI(6)
      
      });

      it("Passive Campaigns", async function () {
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).passive([1])
        await elves.connect(addr3).passive([2])
        await elves.connect(addr3).passive([3])
        await elves.connect(addr3).passive([4])

        increaseWorldTimeinSeconds(604700,true);
        await elves.connect(addr3).unStake([1]);
        console.log(await elves.elves(1));
        increaseWorldTimeinSeconds(800,true);
        await elves.connect(addr3).returnPassive([2]);

        increaseWorldTimeinSeconds(604800,true);
        await elves.connect(addr3).returnPassive([3]);
        increaseWorldTimeinSeconds(604800,true);
        increaseWorldTimeinSeconds(604800,true);
        increaseWorldTimeinSeconds(604800,true);
        await elves.connect(addr3).returnPassive([4]);


        elves.tokenURI(1)
        elves.tokenURI(2)
        elves.tokenURI(3)
        elves.tokenURI(4)
        
        
        
        });

       

        
  
  


  });


describe("Bank Functions", function () {
    it("Deposit funds to player credit account", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("1000000000000000000000"));

      expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });
    it("Withdraw funds from player credit account to player wallet", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("2000000000000000000000"));
      await elves.connect(addr3).withdrawSomeTokenBalance("1000000000000000000000")
      await elves.connect(addr3).withdrawTokenBalance();
  
    expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });
    });

  

describe("Admin Functions", function () {
  it("Withdraw funds from contract", async function () {
    await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)});
    await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
    elves.withdrawAll();
    expect(await owner.getBalance().value).to.equal(await beff.getBalance().value);
    });
  it("Add new camp for quests and see if correct rewards are loaded", async function () {
      await campaigns.addCamp(6, 99, 500, 9, 10, 1, 50);
     
      
    });
    it("Flip game active status", async function () {
      await elves.flipActiveStatus()
      expect(await elves.isGameActive()).to.equal(false);
      
    });
  });

  
*/
});


