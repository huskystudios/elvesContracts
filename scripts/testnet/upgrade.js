// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//MAIN 0x13bdee5dfe487a055f3fa523fecdcf8ecdd3b889 EthernalElves
//INVENTORY 0xB8b20372bf0880359d96a3c5e51C09F670C80b87 ElfMetadataHandler
async function main() {
  
  
 // const Elves = await ethers.getContractFactory("PolyEthernalElves");
 // const elves = await upgrades.upgradeProxy("0xBa8EFCA65A99b97741fF3B382Cf198CEB3c9c90F", Elves);


  const Elves = await ethers.getContractFactory("EthernalElvesV2");
  const elves = await upgrades.upgradeProxy("0x4430B68a122966f61aEe861A2D9ec789b03b8631", Elves);
  console.log("upgraded");

  
}

main();