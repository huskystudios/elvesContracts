const hre = require("hardhat");
const { ethers } = require("hardhat");

let huskyAddress = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
let beffAddress =  "0x3296D61C5E737F9847bA52267b1DeBB8Dbff139F"
let validator = "0x80861814a8775de20F9506CF41932E95f80f7035"
const deployer = huskyAddress//"0xe7AF77629e7ECEd41C7B7490Ca9C4788F7c385E5"

const elvesContract = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75"
const mirenContract = "0xe6b055abb1c40b6c0bf3a4ae126b6b8dbe6c5f3f"
const campaignsContract = "0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e"


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
  const Accessories = await ethers.getContractFactory("Accessories");

    ///Deploy art contracts
    console.log("deploying art contracts")
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
    
  
    //Deploying the contracts
    console.log("deploying inventory manager")  
    const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");
    let inventory = await upgrades.deployProxy(MetadataHandler);
    await inventory.deployed();
    console.log("setting up inventory manager")  

    await inventory.setRace([1,10,11,12,2,3], race1.address)
    await inventory.setRace([4,5,6,7,8,9], race2.address)    
    await inventory.setHair([1,2,3,4,5,6,7,8,9], hair.address)  
    await inventory.setWeapons([1,10,11,12,13,14,15], weapons1.address)
    await inventory.setWeapons([23,24,25,26,27,28,29], weapons2.address)
    await inventory.setWeapons([16,17,18,19,2,20,21,22], weapons3.address)
    await inventory.setWeapons([38,39,4,40,41,42], weapons4.address)
    await inventory.setWeapons([3,30,31,32,33,34,35,36,37], weapons5.address)
    await inventory.setWeapons([43,44,45,5,6,7,8,9], weapons6.address)
    await inventory.setAccessories([1,15,16,2,3,4,8,9], accessories.address)

    return inventory
}



async function main() {
  //Miren on Mainnet: 0xE6b055ABb1c40B6C0Bf3a4ae126b6B8dBE6C5F3f
  
  
//  const elves = await deployElves()
//  console.log("Elves", elves.address)
  
  //const campaigns = await deployCampaigns(elves.address)
  //console.log("Campaigns", campaigns.address)
  //impersonate deployer and then deploy the contracts
  
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [deployer],
  });



  const signer = await ethers.getSigner(deployer)
  
  console.log(signer.address)

  
  const Miren = await ethers.getContractFactory("Miren");
  const Elves = await ethers.getContractFactory("EthernalElves");
  const Campaigns = await ethers.getContractFactory("ElfCampaigns");

  //await Miren.connect(signer).attach(mirenContract).setMinter(deployer, 1)
  console.log(await Elves.attach(elvesContract).flipWhitelist())



//  const inventory = await deployArt()
  
  
  //const inventory = await deployArt()
  //console.log("Inventory", inventory.address)
  
  //const ren = await deployMiren()
  //console.log("Miren", ren.address)
 
  console.log("done")


  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
