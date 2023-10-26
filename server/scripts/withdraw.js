require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("withdraw", "Withdraws $DAI from the FlashLoan contract to the owner").setAction(async () => {
    const FlashLoanAddress = process.env.FLASHLOAN;

    const DAIAddress = process.env.DAI;

    const reportBalance = async () => {
        bal = await flashLoan.getBalance(DAIAddress);
        console.log(`>>> FlashLoan's balance in $DAI is ${ethers.utils.formatEther(bal)}.\n`);
    }

    const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(FlashLoanAddress);
    const daiFactory = await ethers.getContractFactory("DAI");
    const dai = await daiFactory.attach(DAIAddress);

    await reportBalance();

    await flashLoan.withdraw(DAIAddress);

    await reportBalance();

});
module.exports = {};