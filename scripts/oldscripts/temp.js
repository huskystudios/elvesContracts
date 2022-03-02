//0x62dccEBAb42EBA60AaF9BfB78b0D9fb8296BDD2B

const hre = require("hardhat");


async function deployCampaigns() {
  const Campaigns = await ethers.getContractFactory("ElfCampaigns");
  console.log("deploying campaigns")
  let campaigns = await Campaigns.deploy();
  await campaigns.deployed();
  await campaigns.initialize("0xd86A8e58D9455877D6B831dE70Aa718EBC71a0a8");
  return campaigns
}

async function main() {

  await deployCampaigns();
  console.log("Campaigns", campaigns.address)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
