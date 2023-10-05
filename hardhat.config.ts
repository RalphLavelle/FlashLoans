import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
require("./scripts/mintERC20");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
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
      url: process.env.MUMBAI_ENDPOINT,
      accounts: [<string>process.env.PRIVATE_KEY]
    }
  }
}
export default config;