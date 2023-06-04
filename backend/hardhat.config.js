require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const {
  PRIVATE_KEY,
  MUMBAI_API_URL,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: MUMBAI_API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
