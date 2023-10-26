import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { Index } from './components/index/app.index';
import { tradeService } from './services/trade.service';
import { saveService } from './services/save.service';
import { Trades } from './components/trades/trades';

@NgModule({
  declarations: [
    Index,
    Trades
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    saveService,
    tradeService
  ],
  bootstrap: [Index]
})
export class AppModule { }
