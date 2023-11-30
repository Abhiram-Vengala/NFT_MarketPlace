const hre = require("hardhat");

async function main() {
  const Upload = await hre.ethers.getContractFactory("MarketPlace");
  const upload = await Upload.deploy();

  await upload.deployed();

  console.log("Library deployed to:", upload.address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
