import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import * as Highcharts from 'highcharts';
import { GraphsService, ApiData } from './graphs.service';
import { flatMap, tap, map, switchMap } from 'rxjs/operators';

declare let require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit, OnDestroy {

  apiData: ApiData;
  arr: number[] = [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3];
  private graphServiceSub: Subscription;
  private graphServiceSymbolSub: Subscription;
  str = "2019-11-25 14:58:00";

  public intradayChart: any = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Chose a Share from the Watchlist'
    },
    subtitle: {
      text: 'Intraday'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
          text: 'Price'
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [
      {
        name: '',
        data: []
      }
    ]
  }

  public historyChart: any = {
    chart: {
      type: 'line'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'History'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
          text: 'Price'
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    series: [ 
    {
      name: '',
      data: []
    },
    { 
      name: '',
      data: []
    }  
  ]
  }

  constructor(private graphService: GraphsService) {
    this.apiData = {
      intraArr: [],
      intraDateArr:  [],
      histArr:  [],
      histDateArr:  []
    }
   }

  ngOnInit() {
    this.plotCharts();
    this.graphServiceSymbolSub = this.graphService.currentSymbol.subscribe(symbol => {
      this.intradayChart.title.text = symbol;
      console.log(symbol);
    });

    // this.plot();

    // this.graphService.currentSymbol.pipe(
    //   map((symbol: string) => {
    //     this.apiData.symbol = symbol;
    //     console.log(symbol);
    //     return symbol;
    //   }),
    //   tap(res => {
    //     console.log(res);
        
    //   })
    // )

    // this.graphService.currentSymbol.pipe(
    //   switchMap((symbol: string) => {
    //     this.apiData.symbol = symbol;
    //     console.log(symbol);
        
    //     return this.graphService.getHistoricalAndIntradayData(symbol);
    //   }),
    //   tap((dataList) => {
    //     let len1 = Object.values(Object.values(dataList[0]['intraday'])).length;      
    //     let len2 = Object.values(Object.values(dataList[1]['history'])).length;
  
    //     for(let i = 0; i < len1; i+=Math.round(len1/10)){
    //       this.apiData.intraArr.unshift(Object.values(Object.values(dataList[0]['intraday']))[i]['close']);
    //       this.apiData.intraDateArr.unshift(Object.values(Object.keys(dataList[0]['intraday']))[i]);
    //     }
  
    //     for(let i = 0; i < len2; i+=Math.round(len2/10)){
    //       this.apiData.histArr.unshift(Object.values(Object.values(dataList[1]['history']))[i]['close']);
    //       this.apiData.histDateArr.unshift(Object.values(Object.keys(dataList[1]['history']))[i]);
    //     }
  
    //     this.intradayChart.xAxis.categories = this.apiData.intraDateArr.map(el => el.slice(11, -3));
    //     this.intradayChart.series[0].data = [...this.apiData.intraArr.map(Number)];
    //     this.historyChart.xAxis.categories = [...this.apiData.histDateArr];
    //     this.historyChart.series[1].data = [...this.apiData.histArr.map(Number)];
    //     console.log(this.intradayChart.xAxis.categories);
        
    //     this.plotCharts();
    //   })
    // )
  }

  plot() {
    this.emptyDataArrays();

    this.graphService.getHistoricalAndIntradayData(this.intradayChart.title.text).subscribe((dataList) => {

      let len1 = Object.values(Object.values(dataList[0]['intraday'])).length;      
      let len2 = Object.values(Object.values(dataList[1]['history'])).length;

      // console.log(Object.keys(dataList[0]['intraday']).map(k => +dataList[0]['intraday'][k]['close']));

      for(let i = 0; i < len1; i+=Math.round(len1/10)){
        this.apiData.intraArr.unshift(Object.values(Object.values(dataList[0]['intraday']))[i]['close']);
        this.apiData.intraDateArr.unshift(Object.values(Object.keys(dataList[0]['intraday']))[i]);
      }

      for(let i = 0; i < len2; i+=Math.round(len2/10)){
        this.apiData.histArr.unshift(Object.values(Object.values(dataList[1]['history']))[i]['close']);
        this.apiData.histDateArr.unshift(Object.values(Object.keys(dataList[1]['history']))[i]);
      }

      this.intradayChart.xAxis.categories = this.apiData.intraDateArr.map(el => el.slice(11, -3));
      this.intradayChart.series[0].data = [...this.apiData.intraArr.map(Number)];
      this.historyChart.xAxis.categories = [...this.apiData.histDateArr];
      this.historyChart.series[1].data = [...this.apiData.histArr.map(Number)];
      console.log(this.intradayChart.title.text);
      
      this.plotCharts();
    });
  }

  emptyDataArrays() {
    this.intradayChart.xAxis.categories = [];
    this.intradayChart.series[0].data = [];
    this.historyChart.xAxis.categories = [];
    this.historyChart.series[1].data = [];

    this.apiData.intraArr = [];
    this.apiData.intraDateArr = [];
    this.apiData.histArr = [];
    this.apiData.histDateArr = [];
  }

  plotCharts() {
    Highcharts.chart('intraday', this.intradayChart);
    Highcharts.chart('history', this.historyChart);
  }

  ngOnDestroy() {
    this.graphServiceSymbolSub.unsubscribe();
  }
}
