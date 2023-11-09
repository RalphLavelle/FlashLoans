require("dotenv").config();
const ethers = require("ethers");
const Addresses = require("./addresses");

const Blockchain = {

    // given a symbol, get its address
    getAddress(options) {
        const addresses = new Addresses();
        return addresses.get(options);
    },

    getStableCoinContract() {
        const abi = [
            "function balanceOf(address account) external view returns (uint256)",
            "function mint(address to, uint256 amount)"
        ];
        return this.getContract({
            address: process.env.STABLECOIN, abi
        });
    },

    getFlashLoanContract() {
        let abi = [
            "modifier onlyOwner()",
            "function requestFlashLoan(address _borrowingToken, uint256 _borrowingAmount, address _buyingToken, uint24 _poolFee) external onlyOwner",
            "function getBalance(address _tokenAddress) public view returns (uint256)",
            "function withdraw(address _tokenAddress) external onlyOwner"
        ];
        const eventSigs = [
            "LoanRequested(address borrowingToken, uint256 borrowingAmount, address buyingToken, uint24 poolFee)",
            "LoanReceived(uint256 amount, uint256 amountOwed)",
            "TokensBought(uint256 amount, address router)",
            "TokensSold(uint256 amount, address router)"
        ];
        abi = abi.concat(eventSigs.map(es => `event ${es}`));
        const events = this.makeEvents(eventSigs);
        
        return this.getContract({
            address: process.env.FLASHLOAN, abi, events
        });
    },

    getContract(options) {
        const provider = this.getProvider();
        const signer = this.getSigner(provider);
        // console.log(`Connecting to the FlashLoan contract at ${process.env.FLASHLOAN}\n`);
        let contract = new ethers.Contract(options.address, options.abi, signer);
        let events = options.events ? options.events : [];
        return {
            address: options.address,
            contract,
            events
        };
    },

    getProvider() {
        const blockchainEndpoint = process.env.BLOCKCHAIN_ENDPOINT;
        return new ethers.providers.JsonRpcProvider(blockchainEndpoint);
    },

    getSigner(provider) {
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        return signer;
    },

    makeEvents(sigs) {
        let events = [];
        sigs.forEach(s => {
            let sParts = s.split("(");
            const name = sParts[0];
            const args = sParts[1].split(")")[0].split(",").map(a => {
                let aParts = a.trim().split(" ");
                return {
                    name: aParts[1],
                    type: aParts[0]
                }
            });
            let event = { name, args };
            events.push(event);
        });
        return events;
    },

    getEventArgs(event, flashloan, txReceipt) {
        const filter = event();
        let args = txReceipt.logs
            .filter(l => l.address === flashloan.contract.address && filter.topics[0] === l.topics[0])
            .map(l => flashloan.contract.interface.parseLog(l))
            .map(e => e.args);
        if(args) return args[0];
        return undefined;
    },

    prettifyError(fullError) {
        const gasLimit = "UNPREDICTABLE_GAS_LIMIT".toLowerCase();
        if(fullError.toLowerCase().indexOf(gasLimit) > -1) {
            return gasLimit.toUpperCase();
        }
        return fullError;
    }
};

module.exports = Blockchain; 
