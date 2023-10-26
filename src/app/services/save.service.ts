import { Injectable } from "@angular/core";
import { ITradeResponse } from "../interfaces";

@Injectable()
export class saveService {

    key = "tradie:trades";
	
	constructor() {}
	
	saveTrade(trade: ITradeResponse): Array<ITradeResponse> {
        let trades = this.getTrades();

        // add the time
        trade.time = new Date();
        trades.push(trade);
        localStorage.setItem(this.key, JSON.stringify(trades));
        return trades;
	}

    getTrades(): Array<ITradeResponse> {
        const trades = localStorage.getItem(this.key);
        if(trades) {
            return JSON.parse(trades);
        } else {
            return [];
        }
    }
}