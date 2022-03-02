const hre = require("hardhat");

let huskyAddress = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
let beffAddress =  "0x3296D61C5E737F9847bA52267b1DeBB8Dbff139F"
let validator = "0x80861814a8775de20F9506CF41932E95f80f7035"



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
  const Accessories1 = await ethers.getContractFactory("Accessories1");

    ///Deploy art contracts
    console.log("deploying hair contracts")
    

    const hair = "0x2D82cCEDcEa7Be931D8c7A431c97D404359a4460"
    const race1 = "0xB52267fD6A4ed57C11ac1218970CCeb3Be31DcD6"
    const race2 = "0x1bA3E713F24d4ABA48876f7E9705c564a6291900"
    const weapons1 = "0xe556EED0674EE928D387f5468dDF4b7894e71779"
    const weapons2 = "0xbE352707Cd0779e1E6B0351A30819479A73c4c5E"
    const weapons3 = "0xD6c53520c80AD706036DB9Cf0Ed3BC168d1b7E4a"
    const weapons4 = "0x74D6b4301b8cAC49A45C466451c0021BC270F85d"
    const weapons5 = "0xd63EdD4E2B310311f717C3597BC980758A05a1b9"
    const weapons6 = "0xA6144C094904aa7B8f1728c96b1dE64e3F414d59"
    const accessories = "0x9D7b022C087dF654acafE401e220730A50C3d53d"

    const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");

    const inventory = MetadataHandler.attach("0x04ff3733a737ffE5f79D0B8F29EAD0E31d512ffD")

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



    /*
    
    
    
     console.log("Accessories", accessories.address)
    
    
   
   
*/
    
/*
   
   
    console.log("waiting to initialize inventory")
    await new Promise(resolve => setTimeout(resolve, 50000))
    console.log("done waiting, initializing inventory")
    console.log("verifying contracts")
    //await hre.run("verify:verify", { address: inventory.address });


  
*/
  
}





async function main() {
  //Miren on Mainnet: 0xE6b055ABb1c40B6C0Bf3a4ae126b6B8dBE6C5F3f
  console.log("deploying inventory manager")
  await deployArt()

  
  //const elves = await deployElves()
  //console.log("Elves", elves.address)
  
  //const campaigns = await deployCampaigns(elves.address)
  //console.log("Campaigns", campaigns.address)

  //const inventory = await deployArt()
  //console.log("Inventory", inventory.address)

  //await hre.run("verify:verify", { address: elves.address });
  
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
