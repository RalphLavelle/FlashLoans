import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { Index } from './components/index/app.index';
import { tradeService } from './services/trade.service';

@NgModule({
  declarations: [
    Index
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    tradeService
  ],
  bootstrap: [Index]
})
export class AppModule { }
