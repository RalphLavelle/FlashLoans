require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("swap", "Test script to swap coins on Uniswap, and other dexes").setAction(async () => {
    
    // tokens
	const tokenIn = {
        name: "USDC",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        balance: 0
    };
	const tokenOut = {
        name: "USDT",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        balance: 0
    };

    const getContract = async () => {
        let swapFactory = undefined;
        swapFactory = await ethers.getContractFactory("Swap");
        const contract = await swapFactory.attach(SwapAddress);
        return contract;
    }

    const reportBalance = async () => {
        tokenIn.balance = await swap.getBalance(tokenIn.address);
		tokenOut.balance = await swap.getBalance(tokenOut.address);
        console.log(`>>> Balance of ${tokenIn.name}: ${tokenIn.balance}, ${tokenOut.name}: ${tokenOut.balance}.\n`);
    }

    const SwapAddress = process.env.SWAP;
    
    let swap = await getContract();

    await reportBalance();

    await swap.trade(tokenIn.address, Math.ceil(tokenIn.balance/2), tokenOut.address);
    
    swap = await getContract();
	
    await reportBalance();
});
module.exports = {};