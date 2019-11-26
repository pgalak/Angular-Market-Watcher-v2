import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Subscription } from 'rxjs';

import { WatchlistService, Symbol } from '../../watchlist/watchlist.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  symbolTable: string = '';
  arr: string[] = [];
  obj: Symbol = {symbol: ''};
  private subscription: Subscription;

  token1: string = 'nATGx8imsSAQNvvflDQnHtLy8sNeA5hpgTJWfmmhPWjUodvhoo7J4hUy9OZS';
  token2: string = 'j5X3JaRlPPX5fKEeoLPR2LlMwoGcReUkXtL6FxSCGPx7U36R8KA6gaxPHHez';
  token3: string = 'mwH1SNZWQBaX7Lpj4eTBrNvVmc0HPRTi3niNcOSx6kx1B8vTNxJnR29YGubO';

  constructor(private watchlistService: WatchlistService,
              private http: HttpClient) { }

  getWatchlist(){
    this.watchlistService.loadWatchlist();
    this.subscription = this.watchlistService.watchlistSub.subscribe(watchlist => {
      for(this.obj of watchlist){
        this.arr.push(this.obj.symbol);
      }
      this.symbolTable = this.arr.join(',');
      this.arr.length = 0;
    });
  }

  public loadShares() {
    return this.http.get(`https://api.worldtradingdata.com/api/v1/stock?symbol=${this.symbolTable}&api_token=${this.token2}`)
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}