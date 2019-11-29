import { Component, OnInit } from '@angular/core';

import { WatchlistService, Row } from '../../watchlist/watchlist.service';
import { GraphsService } from '../graphs/graphs.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  isLoadDisabled: boolean = false;
  stockData;
  headElements = ['Description', 'Stock Exchange', 'Currency', 'Price'];

  public row: Row = {
    id: null,
    symbol: '',
    isSelected: false
  }

  constructor(private watchlistService: WatchlistService,
              private graphsService: GraphsService) { }

  ngOnInit() {
    this.watchlistService.loadWatchlist();
  }

  load() {
    this.isLoadDisabled = true;
    this.watchlistService.getShareData().subscribe(data => {
      this.stockData = data;
    });
  }

  onSelectedRow(index: number, symbol: string) {
    this.row.id = index;
    this.row.symbol = symbol;
    this.row.isSelected = true;
    this.graphsService.changeSymbol(symbol);
  }
}
