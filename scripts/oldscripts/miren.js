const hre = require("hardhat");

async function main() {

  const MirenX = await ethers.getContractFactory("MirenX");

  //Deploying the contracts
  let ren = await MirenX.deploy(); 
  
  console.log("Miren deployed to:", ren.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
