// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//MAIN 0x13bdee5dfe487a055f3fa523fecdcf8ecdd3b889 EthernalElves
//INVENTORY 0xB8b20372bf0880359d96a3c5e51C09F670C80b87 ElfMetadataHandler
async function main() {
  const Elves = await ethers.getContractFactory("PolyEthernalElvesV3");
  const elves = await upgrades.upgradeProxy("0x4deab743f79b582c9b1d46b4af61a69477185dd5", Elves);
  console.log("upgraded");
  console.log(elves.address);
}

main();