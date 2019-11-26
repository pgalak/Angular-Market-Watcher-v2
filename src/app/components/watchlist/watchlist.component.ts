import { Component, OnInit, OnDestroy } from '@angular/core';

import { WatchlistService, Symbol, Row } from './watchlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlist: Symbol[];
  private wLSub: Subscription;

  public row: Row = {
    id: null,
    symbol: '',
    isSelected: false
  }

  constructor(
    private watchlistService: WatchlistService,

  ) { }

  ngOnInit() {
    this.watchlistService.loadWatchlist();
    this.wLSub = this.watchlistService.watchlistSub.subscribe(watchlist => {
      this.watchlist = watchlist;
    });
    console.log(this.watchlist.length);
    
  }

  onSelectedRow(index: number, symbol: string) {
    this.row.id = index;
    this.row.symbol = symbol;
    this.row.isSelected = true;
    this.watchlistService.selectedRow.next(this.row);
    console.log(this.row);
  }

  ngOnDestroy() {
    this.wLSub.unsubscribe();
  }
}