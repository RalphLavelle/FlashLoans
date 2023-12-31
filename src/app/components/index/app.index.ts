import { Component } from '@angular/core';
import { tradeService } from '../../services/trade.service';
import { saveService } from '../../services/save.service';
import { catchError, of } from 'rxjs';
import { IBalance, ITradeOptions, ITradeResponse } from "./../../interfaces";

@Component({
  selector: 'trading-bot',
  templateUrl: './app.index.html',
  styleUrls: ['./app.index.less']
})
export class Index {

  tradeOptions: any = {
    tokenIn: {
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      amount: 1000000
    },
    tokenOut: {
      symbol: "CHAIN",
      address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39"
  }}

  balance: {
    amount?: number,
    loading: boolean,
    report: string
  };
  trade: {
    loading?: boolean
  };
  trades: Array<ITradeResponse>

  constructor(private tradeSvc: tradeService, private saveSvc: saveService) {}

  ngOnInit() {
    this.trade = {};
    this.getTrades();
    this.getStableCoinBalance();
  }

  getTrades() {
    this.trades = this.saveSvc.getTrades();
  }

  getStableCoinBalance() {
    this.balance = {
      loading: true,
      report: "Loading..."
    };
    
    this.tradeSvc.getBalance(this.tradeOptions.borrow.token).pipe(
        catchError((err: any) => {
          this.balance.report = err.message;
          return of(undefined);
        })
      )
      .subscribe((response: IBalance | undefined) => {
        if(response) {
          this.balance.amount = response.balance;
          this.balance.report = `Balance: ${this.balance.amount} $${this.tradeOptions.borrow.token}`;
        }
        this.balance.loading = false;
      });
  } 

  doTrade() {
    this.trade.loading = true;
    this.tradeSvc.trade(this.tradeOptions).subscribe((res: ITradeResponse) => {

      this.trade.loading = false;

      // save this report
      this.trades = this.saveSvc.saveTrade(res);

      // now get the stablecoin balance again
      this.getStableCoinBalance();
    });
  }
}