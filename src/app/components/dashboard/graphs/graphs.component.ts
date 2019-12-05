import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import * as Highcharts from 'highcharts';
import { GraphsService, ApiData } from './graphs.service';

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
  private graphServiceSymbolSub: Subscription;
  private plotSub: Subscription;
  plotReady: boolean = false;
  error: string = null;

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
    this.graphServiceSymbolSub = this.graphService.currentSymbol.subscribe(symbol => {
      this.intradayChart.title.text = symbol;
      this.plot();
    });
  }

  plot() {
    this.emptyDataArrays();

    this.plotSub = this.graphService.getHistoricalAndIntradayData(this.intradayChart.title.text).subscribe(
      dataList => {
        this.plotReady = true;
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

        
        this.plotCharts();
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
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
    this.plotSub.unsubscribe();
    this.graphService.emptySymbol();
    this.emptyDataArrays();
    this.intradayChart.title.text = '';
    this.plotReady = false;
  }
}
