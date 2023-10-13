require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

task("requestFlashLoan", "Requests a flash loan").setAction(async () => {

	const flFactory = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await flFactory.attach(process.env.FLASHLOAN);

	let borrowing = {
		token: process.env.DAI
	};

	// the amount
	const multiple = 1000;
    borrowing.amount = ethers.BigNumber.from(10).pow(18).mul(multiple);

	console.log(`>>> Requesting a flash loan for ${ethers.utils.formatEther(borrowing.amount)} of token ${borrowing.token}.\n`);

	// straight pass-through
	const txResponse = await flashLoan.requestFlashLoan(
		borrowing.token,
		borrowing.amount,
		borrowing.token // need to make this a different token
	);
	const txReceipt = await txResponse.wait();
	const [loanRequested] = txReceipt.events;
	const { token, amount } = loanRequested.args;

	console.log(`token: ${token}, amount: ${amount}`);
});

module.exports = {}