require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("mintDAI", "Mints some $DAI to the FlashLoan contract").setAction(async () => {

    const FlashLoanAddress = process.env.FLASHLOAN;
	const DAIAddress = process.env.DAI;

    const reportBalance = async () => {
        bal = await flashLoan.getBalance(DAIAddress);
        console.log(`>>> FlashLoan's balance is ${ethers.utils.formatEther(bal)} $DAI.\n`);
    }

    console.log(`DAIAddress: ${DAIAddress}`)

    const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(FlashLoanAddress);
    const daiFactory = await ethers.getContractFactory("DAI");
    const dai = await daiFactory.attach(DAIAddress);

    await reportBalance();

    const multiple = 3;
    const coins = ethers.BigNumber.from(10).pow(18).mul(multiple);
    await dai.mint(FlashLoanAddress, coins);
    console.log(`>>> Minted ${ethers.utils.formatEther(coins)} $DAI to the FlashLoan contract.\n`);

    await reportBalance();
});

module.exports = {};