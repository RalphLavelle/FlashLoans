export interface IBalance {
    balance: number;
} 

export interface IBorrowing {
    token: string;
    amount: number;
}

export interface ITrade {
    borrowing: IBorrowing; // e.g. 1000 $DAI
    poolFee?: number // e.g. 3000 for 0.3%
    swapToken: string; // e.g. some altcoin, by symbol (e.g. 'ROGAN')
}

export interface ITradeReport {
    message: string;
} 