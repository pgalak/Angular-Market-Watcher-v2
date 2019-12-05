import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, forkJoin, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

  token: string = environment.token[1];

  constructor(private http: HttpClient) {}

  changeSymbol(symbol: string) {
    this.symbolSource.next(symbol);
  }

  emptySymbol() {
    this.symbolSource.next('');
  }

  public getHistoricalAndIntradayData(symbol: string) {
    let intradayData = this.http.get(
      `https://intraday.worldtradingdata.com/api/v1/intraday?symbol=${symbol}&range=1&interval=1&api_token=${this.token}`
    )
    .pipe(
      catchError(this.handleError)
    );

    let historicalData = this.http.get(`https://api.worldtradingdata.com/api/v1/history?symbol=${symbol}&sort=newest&api_token=${this.token}`);

    return forkJoin([intradayData, historicalData]);
  }

  public handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Data limit reached, navigate to ';
    if(errorRes.error) return throwError(errorMessage);
  }
    
}