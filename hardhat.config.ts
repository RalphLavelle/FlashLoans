require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    mumbai: {
      url: process.env.MUMBAI_ENDPOINT,
      accounts: [<string>process.env.PRIVATE_KEY]
    }
  }
}
