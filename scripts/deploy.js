const hre = require("hardhat");

async function main() {
  const environment = process.env.ENVIRONMENT;
  const [owner] = await ethers.getSigners();
  
  // first, deploy the pool addresses provider
  let poolAddressesProviderAddress = process.env.AAVE_LENDING_POOL;
  if(environment == "local") {
    const Mock = await hre.ethers.getContractFactory("MockPoolAddressesProvider");
    const m = await Mock.deploy();
    await m.deployed();
    poolAddressesProviderAddress = m.address;
    console.log(`MockPoolAddressesProvider contract deployed to ${m.address}`);
  } else {
    console.log(`Using the PoolAddressesProvider contract at ${poolAddressesProviderAddress}.`);
  }

  // Next, deploy the ERC20
  const erc20 = await ethers.getContractFactory("MockERC20");
  const ERC20 = await erc20.deploy();
  await ERC20.deployed();
  console.log(`$MockERC20 deployed to ${ERC20.address}`);

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(poolAddressesProviderAddress);
  await flashLoan.deployed();
  console.log(`FlashLoan contract deployed to ${flashLoan.address}, with owner ${owner.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});