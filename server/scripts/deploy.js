const hre = require("hardhat");

async function main() {
  const environment = process.env.ENVIRONMENT;
  const [owner] = await ethers.getSigners();

  const reportDeployed = (name, contract) => {
    console.log(`${name} deployed to ${contract.address}\n`);
  }
  
  // first, deploy the pool addresses provider
  let poolAddressesProviderAddress = process.env.AAVE_LENDING_POOL;
  if(environment == "local") {
    const Mock = await hre.ethers.getContractFactory("MockPoolAddressesProvider");
    const m = await Mock.deploy();
    await m.deployed();
    poolAddressesProviderAddress = m.address;
    reportDeployed("MockPoolAddressesProvider", m);
  } else {
    console.log(`Using the PoolAddressesProvider contract at ${poolAddressesProviderAddress}.`);
  }

  // Next, deploy UniswapSinglewap
  const uniswap = await hre.ethers.getContractFactory("UniswapSingleSwap");
  const Uniswap = await uniswap.deploy();
  await Uniswap.deployed();
  reportDeployed("UniswapSingleSwap", Uniswap);

  // Next, deploy the DAI
  const dai = await ethers.getContractFactory("DAI");
  const DAI = await dai.deploy();
  await DAI.deployed();
  reportDeployed("$DAI", DAI);

  const FlashLoan = await hre.ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.deploy(poolAddressesProviderAddress);
  await flashLoan.deployed();
  reportDeployed("FlashLoan", flashLoan);
  console.log(`Owner: ${owner.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});