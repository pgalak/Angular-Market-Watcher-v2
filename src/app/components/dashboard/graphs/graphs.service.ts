import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, AsyncSubject } from 'rxjs';

export interface ApiData {
  symbol: string;
  intraArr: string[];
  intraDateArr:  string[];
  histArr:  string[];
  histDateArr:  string[];
}

@Injectable({
  providedIn: 'root'
})
export class GraphsService {
  private symbolSource = new BehaviorSubject('');
  currentSymbol = this.symbolSource.asObservable();

  token1: string = 'nATGx8imsSAQNvvflDQnHtLy8sNeA5hpgTJWfmmhPWjUodvhoo7J4hUy9OZS';
  token2: string = 'j5X3JaRlPPX5fKEeoLPR2LlMwoGcReUkXtL6FxSCGPx7U36R8KA6gaxPHHez';
  token3: string = 'mwH1SNZWQBaX7Lpj4eTBrNvVmc0HPRTi3niNcOSx6kx1B8vTNxJnR29YGubO';

  constructor(private http: HttpClient) {}

  changeSymbol(symbol: string) {
    this.symbolSource.next(symbol);
  }

  public getHistoricalAndIntradayData(symbol: string) {
    let intradayData = this.http.get(`https://intraday.worldtradingdata.com/api/v1/intraday?symbol=${symbol}&range=1&interval=1&api_token=${this.token2}`);
    let historicalData = this.http.get(`https://api.worldtradingdata.com/api/v1/history?symbol=${symbol}&sort=newest&api_token=${this.token2}`);

    return forkJoin([intradayData, historicalData]);
  }
}