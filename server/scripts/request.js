require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const Blockchain = require("./../app/blockchain");

task("request", "Requests a flash loan").setAction(async () => {

	const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(process.env.FLASHLOAN);

	const multiple = 1;

	let tokenIn = {
        symbol: "USDC",
        amount: ethers.BigNumber.from(10).pow(6).mul(multiple)
    };
	tokenIn.address = Blockchain.getAddress(tokenIn.symbol);
	let tokenOut = {
        symbol: "LINK"
    };
	tokenOut.address = Blockchain.getAddress(tokenOut.symbol);

	console.log(`>>> Requesting a flash loan for ${tokenIn.amount} (${tokenIn.amount/10**6}) $${tokenIn.symbol}.\n`);
	console.log(`TokenIn: ${tokenIn.address}\n`);
	console.log(`TokenOut: ${tokenOut.address}\n`);

	const reportBalance = async () => {
        tokenIn.balance = await flashLoan.getBalance(tokenIn.address);
		tokenOut.balance = await flashLoan.getBalance(tokenOut.address);
        console.log(`>>> Balance of ${tokenIn.symbol}: ${tokenIn.balance}, ${tokenOut.symbol}: ${tokenOut.balance}.\n`);
    }
	await reportBalance();

	const getFlashLoan = async () => {
		const txResponse = await flashLoan.requestFlashLoan(
			tokenIn.address,
			tokenIn.amount,
			tokenOut.address, // need to make this a different token
			3000
		);
		const txReceipt = await txResponse.wait();
		const [LoanRequested, LoanReceived] = txReceipt.events;
		const { borrowingToken, borrowingAmount, swappingToken, poolFee } = LoanRequested.args;

		console.log("LoanRequested event:");
		console.log(`borrowingToken: ${borrowingToken}, borrowingAmount: ${ethers.utils.formatEther(borrowingAmount)}, swappingToken: ${swappingToken}, poolFee: ${poolFee}`);

		//if(!!LoanReceived.args) {
			console.log("LoanReceived event:\n");
			const { amount, amountOwed } = LoanReceived.args;
			console.log(`amount: ${amount}, amountOwed: ${amountOwed}`);
		//}
	};

	// await getFlashLoan();
});

module.exports = {}