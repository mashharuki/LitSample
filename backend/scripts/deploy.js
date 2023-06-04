const hre = require("hardhat");

async function main() {
  
  const LitNft = await hre.ethers.getContractFactory("LitNft");
  const litNft = await LitNft.deploy();

  await litNft.deployed();

  console.log(
    `deployed to ${litNft.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
