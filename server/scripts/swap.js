require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("swap", "Test script to swap coins on Uniswap, and other dexes").setAction(async () => {
    const SwapAddress = process.env.SWAP;

	const tokenIn = "0x52D800ca262522580CeBAD275395ca6e7598C014"; // USDC
	const tokenOut = "0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded" // DAI

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

    // await swap.trade(tokenIn, convertedAmount, tokenOut);

    await reportBalance();

});
module.exports = {};