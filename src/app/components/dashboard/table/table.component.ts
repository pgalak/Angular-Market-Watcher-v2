import { Component, OnInit, OnDestroy } from '@angular/core';

import { TableService } from './table.service';
import { WatchlistService, Row } from '../../watchlist/watchlist.service';
import { GraphsService } from '../graphs/graphs.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  isLoadDisabled: boolean = false;
  table: Symbol[];
  stockData;
  headElements = ['Description', 'Stock Exchange', 'Currency', 'Price'];

  public row: Row = {
    id: null,
    symbol: '',
    isSelected: false
  }

  constructor(private watchlistService: WatchlistService,
              private tableService: TableService,
              private graphsService: GraphsService) { }

  ngOnInit() {
    this.tableService.getWatchlist();
  }

  load() {
    this.isLoadDisabled = true;
    this.tableService.loadShares().subscribe((data) => {
      this.stockData = data;
    });
  }

  onSelectedRow(index: number, symbol: string) {
    this.row.id = index;
    this.row.symbol = symbol;
    this.row.isSelected = true;
    this.graphsService.changeSymbol(symbol);
  }

  ngOnDestroy() {
    this.tableService.destroy();
  }
}
