require("dotenv").config();
const fs = require('fs');

class Addresses {

    data;
    network;

    constructor() {
        const path = './data/data.json';
        this.data = fs.readFileSync(path, 'utf8');
        this.network = this.getNetwork(process.env.ENVIRONMENT);
    }

    getNetwork(env) {
        const dict = {
            local: "localhost",
            staging: "mumbai",
            prod: "polygon"
        };
        return dict[env];
    }

    get(options) {
        // symbol is 'DAI', 'USDC', 'LINK', etc
        // lender means it's the borrowingToken
        // dex means it's a swapToken
        try {
            const network = JSON.parse(this.data)[this.network];
            const getName = tokens => tokens.find(n => n.name.toLowerCase() === options.symbol.toLowerCase());
            let token;
            if(options.lender) {
                const lender = network['lenders'].find(n => n.name.toLowerCase() === options.lender.toLowerCase());
                token = getName(lender.tokens);
                
            } else {
                const tokens = network['tokens'];
                token = getName(tokens);
            }
            return token.address;
        } catch (ex) {
            console.log(`Adresses.get() error: ${ex.message}`);
            return undefined;
        }
    }
};

module.exports = Addresses;