import { Component, Input } from "@angular/core";
import { ITradeResponse } from "src/app/interfaces";
import { ethers } from "ethers";

@Component({
    selector: 'trades',
    templateUrl: './trades.html',
    styleUrls: ['./trades.less']
  })
  export class Trades {
    @Input() trades: Array<ITradeResponse>;

    ngOnInit() {
      this.mapTrades();
    }

    ngOnChanges() {
      this.mapTrades();
    }

    mapTrades() {
      const convert = bigNumber => {
        return +ethers.BigNumber.from(bigNumber["hex"]);
      };
      const getColour = t => {
        if(t.events.TokensBought) return 'bought';
        if(t.events.LoanReceived) return 'received';
        if(t.error) return 'error';
        return 'success';
      };
      const prettifyEnv = e => {
        return {
          ...e,
          contractAddress: this.abbrHex(e.contractAddress)
        };
      };
      this.trades = this.trades.map(t => {
        return {
          ...t,
          env: t.env ? prettifyEnv(t.env) : {
            contractAddress:'',
            name: 'staging'
          },
          colour: getColour(t),  
          loanRequested: t.events.LoanRequested ? `${convert(t.events.LoanRequested[1])} of ${this.abbrHex(t.events.LoanRequested[0])}, buying ${this.abbrHex(t.events.LoanRequested[2])} (poolFee: ${t.events.LoanRequested[3]})` : '',
          loanReceived: t.events.LoanReceived ? `${convert(t.events.LoanReceived[0])} borrowed, ${convert(t.events.LoanReceived[1])} owed` : '',
          tokensBought: t.events.TokensBought ? `${t.events.TokensBought[0]} bought, using ${this.abbrHex(t.events.TokensBought[1])}` : '',
        }
      });
    }

    abbrHex(hex: string): string {
      return `${hex.slice(0, 6)}...`;
    }
  }