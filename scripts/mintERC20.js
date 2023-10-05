require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("mintERC20", "Mints some coin to the FlashLoan contract").setAction(async () => {

    const FlashLoanAddress = process.env.FLASHLOAN;
	const ERC20Address = process.env.ERC20;

    console.log(`ERC20Address: ${ERC20Address}`)

    const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(FlashLoanAddress);
    const erc20Factory = await ethers.getContractFactory("MockERC20");
    const erc20 = await erc20Factory.attach(ERC20Address);

    let bal = await flashLoan.getBalance(ERC20Address);
    console.log(`>>> FlashLoan's balance of ERC20 is ${bal}.\n`);

    const multiple = 3;
    const coins = ethers.BigNumber.from(10).pow(18).mul(multiple);
    await erc20.mint(FlashLoanAddress, coins);
    console.log(`>>> Minted ${ethers.utils.formatEther(coins)} erc20 coins to the FlashLoan contract.`);

    bal = await flashLoan.getBalance(ERC20Address);
    console.log(`>>> FlashLoan's balance of ERC20 is ${bal}.\n`);
});

module.exports = {};