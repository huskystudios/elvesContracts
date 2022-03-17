const hre = require("hardhat");

//POLY let imAddress = "0x3cF1630393BFd1D9fF52bD822fE88714FC81467E"

let imAddress = "0x04ff3733a737ffE5f79D0B8F29EAD0E31d512ffD"




async function deployArt() {

  const Accessories3 = await ethers.getContractFactory("Accessories3");
  const Accessories4 = await ethers.getContractFactory("Accessories4");
  

  
  ///Deploy art contracts
    console.log("deploying art contract")

    const accessories3 = await Accessories3.deploy();
    const accessories4 = await Accessories4.deploy();
   
  
    //Deploying the contracts
    console.log("attaching inventory manager")  
    const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandlerV2");

    const inventory = MetadataHandler.attach(imAddress)
    console.log("setting up inventory manager with new art")  
    
    

    await inventory.setAccessories([2,3], accessories3.address)
    await inventory.setAccessories([10,11,17,18], accessories4.address)

 
}



async function main() {
    
  

  const inventory = await deployArt()


 
  console.log("done")


  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
