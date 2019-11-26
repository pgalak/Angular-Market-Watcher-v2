import { Component, OnInit, OnDestroy, OnChanges, DoCheck } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  watchListSelectedRow: Row

  constructor(public dataService: DataService,
              public watchlistService: WatchlistService) 
  { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.shares$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.dataService.searchShares(term))
    );

    this.selectedRowsubscription.add(this.watchlistService.selectedRow.subscribe( watchlistSelectedRow => {
        this.watchListSelectedRow = watchlistSelectedRow;
    }));
  }

  onSelectedRow(index: number, symbol: string) {
    this.selectedRow = index;
    this.selectedSymbol = symbol;
    this.isShareSelected = true;
  }

  onAdd() {
    const newSymbol: Symbol = {
      symbol: this.selectedSymbol
    }
    this.watchlistService.addSymbol(newSymbol);
  }

  onDelete() {
    console.log(this.watchListSelectedRow);
    this.watchlistService.deleteSymbol(this.watchListSelectedRow);
  }

  onSave() {
    this.watchlistService.saveWatchlist();
  }

  ngOnDestroy() {
    this.selectedRowsubscription.unsubscribe();
    this.wathlistSubscription.unsubscribe();
  }
}
