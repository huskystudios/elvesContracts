// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//MAIN 0x13bdee5dfe487a055f3fa523fecdcf8ecdd3b889 EthernalElves
//INVENTORY 0xB8b20372bf0880359d96a3c5e51C09F670C80b87 ElfMetadataHandler
async function main() {
  const Campaigns = await ethers.getContractFactory("ElfCampaignsV3");
  const campaigns = await upgrades.upgradeProxy("0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e", Campaigns);
  console.log("upgraded");
}

main();