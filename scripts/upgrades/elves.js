// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//MAIN 0x13bdee5dfe487a055f3fa523fecdcf8ecdd3b889 EthernalElves
//INVENTORY 0xB8b20372bf0880359d96a3c5e51C09F670C80b87 ElfMetadataHandler
async function main() {
  const Elves = await ethers.getContractFactory("EthernalElvesV4");
  const elves = await upgrades.upgradeProxy("0xA351B769A01B445C04AA1b8E6275e03ec05C1E75", Elves);
  console.log("upgraded");
}

main();