// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");
//0x3cF1630393BFd1D9fF52bD822fE88714FC81467E
async function main() {
  const Inventory = await ethers.getContractFactory("ElfMetadataHandlerV2");
  const inventory = await upgrades.upgradeProxy("0x04ff3733a737ffE5f79D0B8F29EAD0E31d512ffD", Inventory);
  console.log("upgraded");
}

main();