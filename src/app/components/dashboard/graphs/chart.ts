export interface Chart {
  chart: {
    type: string
  },
  title: {
    text: string
  },
  subtitle: {
    text: string
  },
  xAxis: {
    categories: []
  },
  yAxis: {
    title: {
        text: string
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
    name: string,
    data: []
  }
  ]
}