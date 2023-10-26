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
    const coin = req.query.coin;
    const coinAddress = Blockchain.getAddress({ symbol: coin });
    const flashLoan = await Blockchain.getFlashLoanContract();
    let balance = 0;
    
    try {
        balance = await flashLoan.contract.getBalance(coinAddress);
        balance = ethers.BigNumber.from(balance) / 10 ** 6; // n.b. 6 decimals
    } catch(e) {
        console.log(`Error getting balance: ${JSON.stringify(e)}`);
    }
    res.send({
        "balance": balance.toString()
    });
});

app.post('/trade', async (req, res) => {
    const flashLoan = await Blockchain.getFlashLoanContract();
    const tradeOptions = req.body.tradeOptions;

    let response = {
        env: {
            contractAddress: process.env.FLASHLOAN,
            name: process.env.ENVIRONMENT
        },
        events: {},
        tradeOptions
    };

    try {
        response.error = "";

        // borrowing
        const borrowTokenAddress = Blockchain.getAddress({
            symbol: tradeOptions.borrow.token
        });
        if(!borrowTokenAddress) response.error += `Invalid borrow token: ${tradeOptions.borrow.token} `;
        
        // swapping
        const buyTokenAddress = Blockchain.getAddress({
            symbol: tradeOptions.buy.token
        });
        if(!buyTokenAddress) response.error += `Invalid buy token: ${tradeOptions.buy.token}`;

        if(!response.error) {
            const txResponse = await flashLoan.contract.requestFlashLoan(
                borrowTokenAddress,
                tradeOptions.borrow.amount,
                buyTokenAddress,
                tradeOptions.buy.poolFee
            );
            const txReceipt = await txResponse.wait();
            const filters = flashLoan.contract.filters;
           
            response.events.LoanRequested = Blockchain.getEventArgs(filters.LoanRequested, flashLoan, txReceipt);
            response.events.LoanReceived = Blockchain.getEventArgs(filters.LoanReceived, flashLoan, txReceipt);
            response.events.TokensBought = Blockchain.getEventArgs(filters.TokensBought, flashLoan, txReceipt);
            response.events.TokensSold = Blockchain.getEventArgs(filters.TokensSold, flashLoan, txReceipt);
        }
    } catch(ex) {
        const error = Blockchain.prettifyError(ex.message);
        response.error += error;
    }
    // console.log(`>>> response: ${JSON.stringify(response)}`);
    res.send(response);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Tradie listening at http://localhost:${port}`)
})