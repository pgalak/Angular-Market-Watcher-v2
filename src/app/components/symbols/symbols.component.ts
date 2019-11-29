import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';

import { DataService } from 'src/app/data.service';
import { Share } from '../../share';
import { WatchlistService, Symbol, Row } from '../watchlist/watchlist.service';

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.scss']
})
export class SymbolsComponent implements OnInit, OnDestroy{
  shares$: Observable<Share[]>;
  private searchTerms = new Subject<string>();
  selectedRow: number;
  selectedSymbol: string = '';
  isShareSelected: boolean = false;
  selectedRowsubscription = new Subscription();
  wathlistSubscription = new Subscription();
  watchListSelectedRow: Row;
  disabled: boolean;
  watchlist: string[] = [];
  disableRemoveButton: boolean;
  isLoading: boolean = false;
  noResults: boolean = true;

  constructor(public dataService: DataService,
              public watchlistService: WatchlistService) 
  { }

  search(term: string): void {
    this.searchTerms.next(term);
    this.isLoading = true;
    this.noResults = false;
    setTimeout(() => this.isLoading = false, 400);
    if(!term) {
      setTimeout(() => this.noResults = true, 500);
    }
  }

  ngOnInit(): void {
    this.watchlistService.loadWatchlist();
    this.shares$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.dataService.searchShares(term))
    );

    this.selectedRowsubscription.add(this.watchlistService.selectedRow.subscribe( watchlistSelectedRow => {
        this.watchListSelectedRow = watchlistSelectedRow;
        this.disableRemoveButton = !watchlistSelectedRow.isSelected;
    }));

    this.wathlistSubscription.add(this.watchlistService.watchlistSub.subscribe(watchlist => {
      this.watchlist = watchlist.map(({symbol}) => symbol);
      this.verifyDisabled();
    }));
  }

  onSelectedRow(index: number, symbol: string) {
    
    this.isShareSelected = true;
    this.selectedRow = index;
    this.selectedSymbol = symbol;
    this.verifyDisabled();
    if(this.disabled === true ) return;
    
    if(this.watchlist.includes(symbol)){
      this.disabled = true;
      return;
    }
  }

  onAdd() {
    const newSymbol: Symbol = {
      symbol: this.selectedSymbol
    }
    this.watchlist.push(this.selectedSymbol);
    this.watchlistService.addSymbol(newSymbol);
    this.emptyValues();
  }

  onDelete() {
    this.watchlist.splice(this.watchlist.indexOf(this.selectedSymbol), 1);
    
    this.watchlistService.deleteSymbol(this.watchListSelectedRow);
    this.emptyValues();
    this.disableRemoveButton = true;
  }

  onSave() {
    this.watchlistService.saveWatchlist();
    this.emptyValues();
  }

  emptyValues() {
    this.selectedRow = null;
    this.selectedSymbol = '';
    this.isShareSelected = false;
    this.disabled = true;
  }

  verifyDisabled() {
    if(this.watchlist.length > 4 || this.isShareSelected === false) {
      this.disabled = true;
    }else if (this.watchlist.length < 5 ) {
      this.disabled = false;
    }
  }

  ngOnDestroy() {
    this.selectedRowsubscription.unsubscribe();
    this.wathlistSubscription.unsubscribe();
  }
}
