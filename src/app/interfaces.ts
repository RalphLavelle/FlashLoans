export interface IBalance {
    balance: number;
} 

// export interface IBorrowing {
//     token: string;
//     amount: number;
// }

export interface ITradeOptions {
    borrow: {
        amount: number;
        provider: string; // e.g. "Aave"
        token: string;
    };
    buy: {
        poolFee: number; // e.g. 3000 for 0.3%
        provider: string; // e.g. "Uniswap"
        token: string;
    };
    sell: {
        provider: string; // e.g. "Sushiswap"
    }
}

// returned from the smart contract/back-end
export interface ITradeResponse {
    env: {
        contractAddress: string,
        name: string
    },
    error: string,
    events: {
        LoanRequested: any[],
        LoanReceived: any[],
        TokensBought: any[],
        TokensSold: any[]
    },
    time?: Date,
    tradeOptions: ITradeOptions
}