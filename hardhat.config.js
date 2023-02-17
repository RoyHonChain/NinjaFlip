require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_GOERLI_URL=process.env.ALCHEMY_GOERLI_URL;
const GOERLI_PRIVATE_KEY=process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API=process.env.ETHERSCAN_API;

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 10000
      }
    },
    goerli:{
      url:ALCHEMY_GOERLI_URL,
      accounts:[GOERLI_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  }
};
