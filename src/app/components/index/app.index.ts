import { Component } from '@angular/core';
import { tradeService } from '../../services/trade.service';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'trading-bot',
  templateUrl: './app.index.html',
  styleUrls: ['./app.index.less']
})
export class Index {
  
  report = "";
  balance: 0;
  erc20: string;

  constructor(private tradeSvc: tradeService) {
    this.erc20 = environment.blockchain.network.ERC20;
  }

  ngOnInit() {
    this.tradeSvc.getBalance(this.erc20).subscribe((data) => {
      debugger;
      this.balance = data;
    });
  }

  trade() {
    this.report = "Loading..."
    // this.tradeSvc.trade().subscribe((data) => {
    //   this.report = data;
    // });
  }
}