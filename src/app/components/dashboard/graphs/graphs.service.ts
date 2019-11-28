import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, AsyncSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ApiData {
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

  token: string = environment.token[0];

  constructor(private http: HttpClient) {}

  changeSymbol(symbol: string) {
    this.symbolSource.next(symbol);
  }

  public getHistoricalAndIntradayData(symbol: string) {
    let intradayData = this.http.get(`https://intraday.worldtradingdata.com/api/v1/intraday?symbol=${symbol}&range=1&interval=1&api_token=${this.token}`);
    let historicalData = this.http.get(`https://api.worldtradingdata.com/api/v1/history?symbol=${symbol}&sort=newest&api_token=${this.token}`);

    return forkJoin([intradayData, historicalData]);
  }
}