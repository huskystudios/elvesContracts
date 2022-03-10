/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("hardhat-gas-reporter");
require("hardhat-contract-sizer")

const isPolygon = false;


const { 
   MAINNET_API_URL, MAINNET_PRIVATE_KEY, 
   POLYGON_API_URL, POLYGON_PRIVATE_KEY, 
   RINKEBY_API_URL, RINKEBY_PRIVATE_KEY, 
   MUMBAI_API_URL, MUMBAI_PRIVATE_KEY, 
   GOERLI_API_URL, GOERLI_PRIVATE_KEY,    
   ETHERSCAN_API, POLYSCAN_API} = process.env;
module.exports = {
   solidity: {
		version: "0.8.7",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
   defaultNetwork: "hardhat",
   gasReporter: {
      currency: 'USD',
      gasPrice: 160,
      enable: true,
      coinmarketcap : "f77106bb-8d2f-4f30-be3c-821bd68ac7bd",
    },
    mocha: {
      timeout: 120000
    },
   networks: {
      hardhat: { 
         forking: {
         url: POLYGON_API_URL,//MAINNET_API_URL,
          }
      },
      mainnet: {
         url: MAINNET_API_URL,
         accounts: [`0x${MAINNET_PRIVATE_KEY}`]
      },
      polygon: {
         url: POLYGON_API_URL,
         accounts: [`0x${POLYGON_PRIVATE_KEY}`]
      },
      goerli: {
         url: GOERLI_API_URL,
         accounts: [`0x${GOERLI_PRIVATE_KEY}`]
      },
      rinkeby: {
         url: RINKEBY_API_URL,
         accounts: [`0x${RINKEBY_PRIVATE_KEY}`]
      },
      mumbai:{
         url: MUMBAI_API_URL,
         accounts: [`0x${MUMBAI_PRIVATE_KEY}`]
      }
   },
   etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: {
         mainnet: ETHERSCAN_API,
         polygon: POLYSCAN_API,
      },
         
    },
}

////