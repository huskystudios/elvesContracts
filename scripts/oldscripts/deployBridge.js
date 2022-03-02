const hre = require("hardhat");

const isEthereum = false

const FxChild = isEthereum ? "0x8397259c983751DAf40400790063935a11afa28a" : "0xCf73231F28B7331BBe3124B907840A94851f9f11"   //MUMBAI
const FxBaseRoot = isEthereum ? "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2" : "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA"   //GOERLI
const checkpointmanager = isEthereum ? "0x86e4dc95c7fbdbf52e33d563bbdb00823894c287" : "0x2890bA17EfE978480615e330ecB65333b880928e"   //GOERLI

let elves = "0x365271EA323BAf27B97886Fa78872C7ef5505Db1"
let ren = "0x9f4b65278c6c9c5df4ed430642d46e2193d7b3a6"

let polyelves = ""
let polyren =""

let terminusAddress = ""
let polyTerminusAddress = ""

let fxrootaddress = ""
let childrootaddress = ""

async function eth() {

const FxBaseRootTunnel = await ethers.getContractFactory("FxBaseRootTunnel"); //GOERLI
const Terminus = await ethers.getContractFactory("Terminus"); 
const Miren = await ethers.getContractFactory("Miren");

console.log("Setting up contract factories")
   
      console.log("Deploying RootTunnel")
      const fxbaseroottunnel = await FxBaseRootTunnel.deploy()
      fxbaseroottunnel.initialize(FxBaseRoot, checkpointmanager)

  console.log("Deploying Terminus")
  const terminus = await Terminus.deploy()
  await terminus.deployed()

  //allow terminus to use the fxbaseroottunnel
  await fxbaseroottunnel.setAuth([terminus.address], true)
  
  await terminus.initialize(fxbaseroottunnel.address, elves, ren)
  
  ///Let Terminus mint using Miren
  await Miren.attach(ren).setMinter(terminus.address, 1)

  /*
  console.log("verifying contracts")
  await hre.run("verify:verify", { address: terminus.address });
  await hre.run("verify:verify", { address: fxbaseroottunnel.address });  
  */
  

  console.log("fxbaseroottunnel deployed to:", fxbaseroottunnel.address);
  console.log("terminus deployed to:", terminus.address);

}



async function polygon() {

const Terminus = await ethers.getContractFactory("Terminus"); 
const FxBaseChildTunnel = await ethers.getContractFactory("FxBaseChildTunnel");  //MUMBAI
const MirenX = await ethers.getContractFactory("MirenX");
   
  
   console.log("Deploying RootTunnel")    
   const fxbasechildtunnel = await FxBaseChildTunnel.deploy()  
   const fxRootTunnelAddress = fxrootaddress //Make sure you have the correct addresses for the contracts.

   fxbasechildtunnel.initialize(FxChild, fxRootTunnelAddress)
    
   const terminus = await Terminus.deploy()
   await terminus.deployed()
  
   fxbasechildtunnel.setAuth([terminus.address], true)
    
   terminus.initialize(fxbasechildtunnel.address, polyelves, polyren)
    
   ///Let Terminus mint using Miren
   MirenX.attach(polyren).setMinter(terminus.address, 1)

   /*
   console.log("verifying contracts")
   await hre.run("verify:verify", { address: terminus.address });
   await hre.run("verify:verify", { address: fxbasechildtunnel.address });  
 */
   console.log("fxbasechildtunnel deployed to:", fxbasechildtunnel.address);
   console.log("terminus deployed to:", terminus.address);
 
}

async function permissionsEth() {
    
  const FxBaseRootTunnel = await ethers.getContractFactory("FxBaseRootTunnel"); //GOERLI
  const Terminus = await ethers.getContractFactory("Terminus"); 
  
    
  const terminusDeployed = await Terminus.attach(terminusAddress)
     
    terminusDeployed.setContractPairs(fxrootaddress, childrootaddress) //RXROOT and FXCHILD
    terminusDeployed.setContractPairs(ren, polyren)  //REN on Poly and REN on Mainnet
    terminusDeployed.setContractPairs(elves, polyelves)   //Elves on Poly and Elves on Mainnet.
    terminusDeployed.setContractPairs(terminusAddress, polyTerminusAddress)   //terminus on Poly and terminus on Mainnet.

    FxBaseRootTunnel.attach(fxrootaddress).setFxChildTunnel(childrootaddress)
    
}

async function permissionsPolygon() {

  const Terminus = await ethers.getContractFactory("Terminus"); 
  
  const terminusDeployed = await Terminus.attach(polyTerminusAddress)
   
  terminusDeployed.setContractPairs(fxrootaddress, childrootaddress) //RXROOT and FXCHILD
  terminusDeployed.setContractPairs(ren, polyren)  //REN on Poly and REN on Mainnet
  terminusDeployed.setContractPairs(elves, polyelves)   //Elves on Poly and Elves on Mainnet.
  terminusDeployed.setContractPairs(terminusAddress, polyTerminusAddress)   //terminus on Poly and terminus on Mainnet.

 
}


async function main() {
  
  await eth()
  //await polygon()
  //await permissionsEth()
  //await permissionsPolygon()
  
  



 
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
