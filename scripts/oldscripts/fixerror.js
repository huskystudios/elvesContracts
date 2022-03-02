const hre = require("hardhat");

async function main() {

  const EE = await ethers.getContractFactory("EthernalElvesV2");
  //0xA351B769A01B445C04AA1b8E6275e03ec05C1E75
  //Deploying the contracts
  let elves = await EE.attach("0xA351B769A01B445C04AA1b8E6275e03ec05C1E75"); 
  /*
  await elves.setElfManually(1032,4,2,6,26,12,3 )
  await elves.setElfManually(1091,7,3,12,21,22,3)
  await elves.setElfManually(1213,7,3,10,25,22,3)
  await elves.setElfManually(1435,7,3,10,25,22,3)
  await elves.setElfManually(1678,7,3,12,22,25,3)
  await elves.setElfManually(1679,7,3,12,22,25,3)
  await elves.setElfManually(1751,7,3,10,25,22,3)
  await elves.setElfManually(1831,7,3,10,25,22,3)
  await elves.setElfManually(1842,4,2,10,18,13,3)
  await elves.setElfManually(1978,7,3,10,25,22,3)
  await elves.setElfManually(2192,7,3,12,21,22,3)
  await elves.setElfManually(2225,4,2,10,20,19,3)
  /
  await elves.setElfManually(2434,7,3,8,29,22,4)
  await elves.setElfManually(2682,7,3,12,22,25,3)
  await elves.setElfManually(2902,7,3,10,27,29,3)
  await elves.setElfManually(2959,7,3,12,21,22,3)
  await elves.setElfManually(2969,7,3,10,25,22,3)
  await elves.setElfManually(3118,4,2,10,20,19,3)
  await elves.setElfManually(3174,4,2,6,27,15,3)
  await elves.setElfManually(3242,7,3,10,25,22,3)
  await elves.setElfManually(3249,7,3,12,21,22,3)
  await elves.setElfManually(3272,4,2,10,20,19,2)
  
  await elves.setElfManually(3383,7,3,12,23,27,3)
  await elves.setElfManually(3385,7,3,8,33,33,4)
  await elves.setElfManually(3411,7,3,10,25,21,3)
  await elves.setElfManually(3602,7,3,12,24,30,3)
  await elves.setElfManually(3613,7,3,10,26,24,3)
  await elves.setElfManually(3614,7,3,12,22,24,3)
  await elves.setElfManually(3808,7,3,10,25,21,3)
  await elves.setElfManually(3810,7,3,10,25,21,3)
  await elves.setElfManually(3813,7,3,10,25,21,3)
  await elves.setElfManually(3814,7,3,10,25,21,3)
  await elves.setElfManually(3880,7,3,12,22,24,3)
  /*/
  await elves.setElfManually(4021,7,3,12,21,23,2)
  await elves.setElfManually(4051,7,3,10,24,20,3)
  await elves.setElfManually(4527,7,3,10,25,21,3)
  await elves.setElfManually(4539,7,3,12,21,21,3)
  await elves.setElfManually(4617,4,2,6,27,17,3)
  await elves.setElfManually(4685,4,2,10,20,18,3)
  await elves.setElfManually(4732,4,2,10,19,15,3)
  await elves.setElfManually(4752,4,2,8,23,15,3)
  await elves.setElfManually(4785,4,2,8,23,15,3)
  await elves.setElfManually(4786,4,2,10,19,15,3)

  console.log("done")
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
