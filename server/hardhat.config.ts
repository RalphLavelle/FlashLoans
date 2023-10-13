import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
require("./scripts/mintDAI");
require("./scripts/requestFlashLoan");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.8.0",
      }
    ],
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: process.env.BLOCKCHAIN_ENDPOINT,
      accounts: [<string>process.env.PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  }
}
export default config;