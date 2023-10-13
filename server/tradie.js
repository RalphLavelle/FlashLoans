const express = require('express');
var cors = require('cors')
const app = express();
require('dotenv').config();
var ethers = require("ethers");
const Blockchain = require("./app/blockchain");

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send("Tradie!");
});

app.get('/balance', async (req, res) => {
    const erc20 = await Blockchain.getDaiContract();
    let balance = 0;
    try {
        balance = await erc20.balanceOf(process.env.FLASHLOAN);
        balance = ethers.BigNumber.from(balance) / 10 ** 18;
    } catch(e) {
        console.log(`Error getting balance: ${JSON.stringify(e)}`);
    }
    res.send({
        "balance": balance.toString()
    });
});

app.post('/trade', async (req, res) => {
    const flashLoan = await Blockchain.getFlashLoanContract();
    const trade = req.body.trade;

    // Hardcoded, for the time being
    const lender = "Aave";
    const dex = "Uniswap";

    let message = `${trade.borrowing.amount} of token ${trade.borrowing.token} requested from ${lender}, which will be used to trade ${trade.swapToken} on ${dex}`;
    console.log(message);
    try {
        let error = "";

        // borrowing
        const borrowingTokenAddress = Blockchain.getAddress({
            symbol: trade.borrowing.token,
            lender
        });
        if(!borrowingTokenAddress) error += `Invalid borrowing token: ${trade.trade.borrowing.token} `;
        
        // swapping
        const swapTokenAddress = Blockchain.getAddress({
            symbol: trade.swapToken,
            dex
        });
        if(!swapTokenAddress) error += `Invalid swap token: ${trade.swapToken}`;

        if(error) {
            message = error;
        } else {
            const txResponse = await flashLoan.requestFlashLoan(
                borrowingTokenAddress,
                trade.borrowing.amount,
                swapTokenAddress,
                trade.poolFee
            );
            const txReceipt = await txResponse.wait();
            const [ loanRequested ] = txReceipt.events;
            const { borrowingToken, borrowingAmount, swapToken } = loanRequested.args;
        }
        res.send({ message });
    } catch(ex) {
        res.send({
            message: `${message}, but there was an error: ${ex.message}.`
        });
    }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Tradie listening at http://localhost:${port}`)
})