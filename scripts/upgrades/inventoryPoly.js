// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//
async function main() {
  const Inventory = await ethers.getContractFactory("ElfMetadataHandlerV2");
  const inventory = await upgrades.upgradeProxy("0x3cF1630393BFd1D9fF52bD822fE88714FC81467E", Inventory);
  console.log("upgraded");
}

main();