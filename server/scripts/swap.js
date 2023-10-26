require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("swap", "Test script to swap coins on Uniswap, and other dexes").setAction(async () => {
    const SwapAddress = process.env.SWAP;

	const tokenIn = "0xFEca406dA9727A25E71e732F9961F680059eF1F9"; // USDC
	const tokenOut = "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7" // GHST

    const reportBalance = async () => {
        balTokenIn = await swap.getBalance(tokenIn);
		balTokenOut = await swap.getBalance(tokenOut);
		const format = bal => ethers.utils.formatEther(bal)
        console.log(`>>> Balance of tokenIn: ${format(balTokenIn)}, tokenOut: ${format(balTokenOut)}.\n`);
    }

    const swapFactory = await ethers.getContractFactory("Swap");
    const swap = await swapFactory.attach(SwapAddress);

    await reportBalance();

	const amount = 1;
    const convertedAmount = ethers.BigNumber.from(10).pow(6).mul(amount);

    await swap.trade(tokenIn, convertedAmount, tokenOut);

    await reportBalance();

});
module.exports = {};