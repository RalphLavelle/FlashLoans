import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { Index } from './components/index/app.index';
import { tradeService } from './services/trade.service';

@NgModule({
  declarations: [
    Index
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    tradeService
  ],
  bootstrap: [Index]
})
export class AppModule { }
