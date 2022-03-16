const hre = require("hardhat");

let huskyAddress = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
let beffAddress =  "0x3296D61C5E737F9847bA52267b1DeBB8Dbff139F"
let validator = "0x80861814a8775de20F9506CF41932E95f80f7035"
let oparator = "0xa2B877EC3234F50C33Ff7d0605F7591053d06E31"

///npx hardhat verify --network mainnet 0x858c52bbc608435f035b1913ec0228322ac54c2e 

//npx hardhat run scripts/testnet/deploy.js --network hardhat


async function PolyEthernalElves() {
  const Elves = await ethers.getContractFactory("PolyEthernalElvesV4");
  
  console.log("deploying elves")

  const elves = await upgrades.deployProxy(Elves,);
  await elves.deployed();
  
  return elves
}




async function main() {
    
  
  const polyElves = await PolyEthernalElves()
  console.log("contract", polyElves.address)


  
  
  /*
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
