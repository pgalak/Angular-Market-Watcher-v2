import { Component, OnInit, OnDestroy, OnChanges, DoCheck } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { DataService } from 'src/app/data.service';
import { Share } from '../../share';
import { WatchlistService, Symbol, Row } from '../watchlist/watchlist.service';

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.scss'],
  // providers: [DataService, DecimalPipe]
})
export class SymbolsComponent implements OnInit, OnDestroy{
  shares$: Observable<Share[]>;
  private searchTerms = new Subject<string>();
  selectedRow: number;
  selectedSymbol: string = '';
  isShareSelected: boolean = false;
  subscription = new Subscription();
  watchListSelectedRow: Row
  // isWatchlistFull: boolean = this.checkWatchlistLength();

  constructor(public dataService: DataService,
              public watchlistService: WatchlistService) 
  {
    // this.shares$ = dataService.shares$
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.shares$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.dataService.searchShares(term))
    );

    this.subscription.add(this.watchlistService.selectedRow.subscribe( watchlistSelectedRow => {
        this.watchListSelectedRow = watchlistSelectedRow;
    }));
  }

  // checkWatchlistLength(): boolean {
  //   return false ? localStorage.getItem('symbols').length >= 4 : true;
  // }

  // verifyWatchList() {
  //   this.isWatchlistFull = this.checkWatchlistLength();
  // }

  onSelectedRow(index: number, symbol: string) {
    this.selectedRow = index;
    this.selectedSymbol = symbol;
    this.isShareSelected = true;
    // console.log(this.checkWatchlistLength());
    
  }

  onAdd() {
    const newSymbol: Symbol = {
      symbol: this.selectedSymbol
    }
    this.watchlistService.addSymbol(newSymbol);
    // this.verifyWatchList();
  }

  onDelete() {
    console.log(this.watchListSelectedRow);
    this.watchlistService.deleteSymbol(this.watchListSelectedRow);
    // this.verifyWatchList();
  }

  onSave() {
    this.watchlistService.saveWatchlist();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
