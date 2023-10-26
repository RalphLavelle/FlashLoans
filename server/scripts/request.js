require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const Blockchain = require("./../app/blockchain");

task("request", "Requests a flash loan").setAction(async () => {

	const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(process.env.FLASHLOAN);

	const myToken = {
		symbol: "USDC",
		dex: "Uniswap"
	};
	let borrowing = {
		poolFee: 3000,
		token: Blockchain.getAddress(myToken)
	};

	// the amount
	const multiple = 1;
    borrowing.amount = ethers.BigNumber.from(10).pow(6).mul(multiple);

	console.log(`>>> Requesting a flash loan for ${ethers.utils.formatEther(borrowing.amount)} of token ${myToken.symbol} (${borrowing.token}).\n`);

	// straight pass-through
	const txResponse = await flashLoan.requestFlashLoan(
		borrowing.token,
		borrowing.amount,
		borrowing.token, // need to make this a different token
		borrowing.poolFee
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
});

module.exports = {}