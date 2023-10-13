require("dotenv").config();
const ethers = require("ethers");
const Addresses = require("./addresses");

const Blockchain = {

    // given a symbol, get its address
    getAddress(options) {
        const addresses = new Addresses();
        return addresses.get(options);
    },

    getProvider() {
        let provider;
        const environment = process.env.ENVIRONMENT;
        const blockchainEndpoint = process.env.BLOCKCHAIN_ENDPOINT;
        if (environment === "local") {
            provider = new ethers.providers.JsonRpcProvider(blockchainEndpoint);
        } else {
            const network = blockchainEndpoint;
            const apiKey = process.env.InfuraAPIKey;
            console.log(`Connecting to ${network} with ${apiKey}.`);
            provider = new ethers.providers.InfuraProvider(network, apiKey);
        }
        return provider;
    },

    getSigner(provider) {
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        return signer;
    },

    getDaiContract() {
        const provider = this.getProvider();
        const signer = this.getSigner(provider);
        // console.log(`Connecting to ERC20 contract at ${process.env.ERC20} with signer ${signer.address}\n`);
        const abi = [
            "function balanceOf(address account) public view returns (uint256)",
            "function mint(address to, uint256 amount)"
        ];
        return new ethers.Contract(process.env.DAI, abi, signer);
    },

    getFlashLoanContract() {
        const provider = this.getProvider();
        const signer = this.getSigner(provider);
        // console.log(`Connecting to the FlashLoan contract at ${process.env.FLASHLOAN}\n`);
        const abi = [
            "event LoanRequested(address borrowingToken, uint256 borrowingAmount, address swapToken, uint24 poolFee)",
            "function requestFlashLoan(address _borrowingToken, uint256 _borrowingAmount, address _swapToken, uint24 _poolFee) public"
        ];
        let contract = new ethers.Contract(process.env.FLASHLOAN, abi, signer);
        return contract;
    }
};

module.exports = Blockchain;
