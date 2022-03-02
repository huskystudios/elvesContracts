const hre = require("hardhat");

let invetoryAddress = "0x2AbC14AEd72F74C4Dcf6A674237514ac4F398bFA"
let campaignAddress = "0xbF902bF679d938986CE76249C60Af6111A5457b8"
let renAddress =  "0xF114Dbd66f7e69b2635bE7d85418E707AB029a67"
let elvesAddress = "0x4430B68a122966f61aEe861A2D9ec789b03b8631"
//let validator = "0x80861814a8775de20F9506CF41932E95f80f7035" "0xa2B877EC3234F50C33Ff7d0605F7591053d06E31"

async function main() {

  const Miren = await ethers.getContractFactory("Miren");
  const Elves = await ethers.getContractFactory("EthernalElvesV2");
  const Campaigns = await ethers.getContractFactory("ElfCampaignsV3");
  const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");
  

await Miren.attach(renAddress).setMinter(elvesAddress, 1)
await Elves.attach(elvesAddress).setAddresses(renAddress, invetoryAddress, campaignAddress, validator);




console.log("done")  

  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
