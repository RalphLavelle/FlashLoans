import { Component } from '@angular/core';
import { tradeService } from '../../services/trade.service';
import { catchError, of } from 'rxjs';
import { IBalance, IBorrowing, ITrade, ITradeReport } from "./../../interfaces";

@Component({
  selector: 'trading-bot',
  templateUrl: './app.index.html',
  styleUrls: ['./app.index.less']
})
export class Index {

  tradeOptions: ITrade = {
    borrowing: {
      token: 'DAI',
      amount: 1000
    },
    poolFee: 3000,
    swapToken: 'ROGANF'
  };
  
  balance: {
    amount?: number,
    loading: boolean,
    report: string
  };
  trade: {
    loading?: boolean,
    report?: string
  };

  constructor(private tradeSvc: tradeService) {}

  ngOnInit() {
    this.balance = {
      loading: true,
      report: "Loading..."
    };
    this.trade = {};
    this.tradeSvc.getBalance().pipe(
        catchError((err: any) => {
          this.balance.report = err.message;
          return of(undefined);
        })
      )
      .subscribe((response: IBalance | undefined) => {
        if(response) {
          this.balance.amount = response.balance;
          this.balance.report = `Balance: ${this.balance.amount} $DAI`;
        }
        this.balance.loading = false;
      });
  }

  doTrade() {
    this.trade.loading = true;
    this.trade.report = "Loading...";
    this.tradeSvc.trade(this.tradeOptions).subscribe((report: ITradeReport) => {
      debugger
      this.trade.report = report.message;
      this.trade.loading = false;
    });
  }
}