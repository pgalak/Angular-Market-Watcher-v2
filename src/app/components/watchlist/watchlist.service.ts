import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'

import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Symbol {
  symbol: string;
}

export interface Row {
  id: number;
  symbol: string;
  isSelected: boolean;
}

@Injectable({providedIn: 'root'})
export class WatchlistService {
  symbols: Symbol[]; 
  selectedRow: BehaviorSubject<Row> = new BehaviorSubject({id: null, symbol: '', isSelected: false});
  watchlistSub: BehaviorSubject<Symbol[]> = new BehaviorSubject(this.symbols);
  symbolsString: string = '';
  tempArr: string[] = [];

  token: string = environment.token[0];

  constructor(private http: HttpClient) {
    this.symbols = []
  }

  loadWatchlist() {
    if(localStorage.getItem('symbols') === null) {
      this.symbols = [];
    } else {
      this.symbols = JSON.parse(localStorage.getItem('symbols'));
    }
    this.watchlistSub.next(this.symbols);
  }

  getShareData() {
    this.loadWatchlist();
    for(let symbol of this.symbols){
      this.tempArr.unshift(symbol.symbol)
    }
    this.symbolsString = this.tempArr.join(',');

    return this.http.get(`https://api.worldtradingdata.com/api/v1/stock?symbol=${this.symbolsString}&api_token=${this.token}`);
  }

  addSymbol(symbol: Symbol) {
    this.symbols.push(symbol);
  }

  deleteSymbol(row: Row) {
    this.symbols.splice(row.id, 1);
  }

  saveWatchlist() {
    localStorage.setItem('symbols', JSON.stringify(this.symbols));
  }
}