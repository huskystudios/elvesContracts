const hre = require("hardhat");

let huskyAddress = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
let beffAddress =  "0x3296D61C5E737F9847bA52267b1DeBB8Dbff139F"
let validator = "0x80861814a8775de20F9506CF41932E95f80f7035"
let oparator = "0xa2B877EC3234F50C33Ff7d0605F7591053d06E31"

///npx hardhat verify --network mainnet 0x858c52bbc608435f035b1913ec0228322ac54c2e 

//npx hardhat run scripts/testnet/deploy.js --network hardhat


async function deployArt() {
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
  

  
  ///Deploy art contracts
    console.log("deploying art contracts")

    /*const hair = await Hair.deploy();
    const race1 = await Race1.deploy();
    const race2 = await Race2.deploy();
    const weapons1 = await Weapons1.deploy();
    const weapons2 = await Weapons2.deploy();
    const weapons3 = await Weapons3.deploy();
    const weapons4 = await Weapons4.deploy();
    const weapons5 = await Weapons5.deploy();
    const weapons6 = await Weapons6.deploy();
    const accessories = await Accessories.deploy();
    */
  
    //Deploying the contracts
    console.log("deploying inventory manager")  
    const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");
    //let inventory = await upgrades.deployProxy(MetadataHandler);
    //await inventory.deployed();
    const inventory = MetadataHandler.attach("0x3cF1630393BFd1D9fF52bD822fE88714FC81467E")
    console.log("setting up inventory manager")  
    

  
    const race1 = "0x7779f54e74fd020f25679d9af568e5ca9eed7901"
    const race2 = "0xd63edd4e2b310311f717c3597bc980758a05a1b9"
    const hair = "0x5c6264eeac2b2a8c5d5fb6bd4d44edb055e45cf2"
    const weapons1 = "0xa351b769a01b445c04aa1b8e6275e03ec05c1e75"
    const weapons2 = "0xf9d1b048e1f417bfcad8801a0b8a9a4f7dafc0d8"
    const weapons3 = "0x367dd3a23451b8cc94f7ec1ecc5b3db3745d254e"
    const weapons4 = "0x32a02407d33646bbf9ca3f8d4f01d71dcc953da1"
    const weapons5 = "0x93d8ba8a4e4b32e6a1cddbf2d929e58facba9042"
    const weapons6 = "0xb9b9a222782e774c7ecd6dec391d47d764539835"
    const accessories = "0x6df94b08eada7ca46f263a8acce93b795eedfc6a"

    
    await inventory.setRace([1,10,11,12,2,3], race1)
    await inventory.setRace([4,5,6,7,8,9], race2)    
    await inventory.setHair([1,3,2,4,5,6,7,8,9], hair)  
    await inventory.setWeapons([1,10,11,12,13,14,15], weapons1)
    await inventory.setWeapons([23,24,25,26,27,28,29], weapons2)
    await inventory.setWeapons([38,39,4,40,41,42], weapons3)
    await inventory.setWeapons([16,17,18,19,2,20,21,22], weapons4)
    await inventory.setWeapons([3,30,31,32,33,34,35,36,37], weapons5)
    await inventory.setWeapons([43,44,45,5,6,7,8,9,69], weapons6)
    await inventory.setAccessories([15,16,4,5,8,9], accessories)

 
}

async function PolyEthernalElves() {
  const Elves = await ethers.getContractFactory("PolyEthernalElves");
  
  console.log("deploying elves")

  const elves = await upgrades.deployProxy(Elves,);
  await elves.deployed();
  
  return elves
}


async function main() {
    
  await PolyEthernalElves()
 
  
 // console.log("Inventory", inventory.address)


  
  
  /*
  const inventory = await deployArt()

  const pelves = await PolyEthernalElves()
  console.log("Elves", pelves.address)

  const elves = await deployElves()
  console.log("Elves", elves.address)
  
  const campaigns = await deployCampaigns(elves.address)
  console.log("Campaigns", campaigns.address)

  const ren = await deployMiren()
  console.log("Miren", ren.address)

  const inventory = await deployArt()
  console.log("Inventory", inventory.address)

*/
  

 
  console.log("done")


  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
