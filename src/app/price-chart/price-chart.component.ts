import { Component, OnInit } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';
import { Settings } from '../app-setting';
import { ContractService } from '../services/contract.service';
import { Tooltip } from 'chart.js';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.css'],
})
export class PriceChartComponent implements OnInit {
  tokenSymbol: any;
  constructor(private contractService: ContractService) {
    this.tokenSymbol = Settings.coinSymbol;
  }

  async ngOnInit() {
    // var x: any = await (await this.contractService.getCoinRateHistory(1000, 30)).data;
    // //console.log(x)
    // var _labels = [];
    // var _data = [];
    // var cnt = 0;
    // for (var i = x.length - 1; i >= 0; i--) {
    //   if (x[i].Timestamp > 0) {
    //     cnt++;
    //   }
    // }
    // var step = parseInt((cnt / 30).toString());
    // step = step == 0 ? 1 : step;
    // for (var i = x.length - 1; i >= 0; i -= step) {
    //   if (x[i].Timestamp > 0) {
    //     var t = x[i].Timestamp;
    //     var d = new Date(0);
    //     d.setUTCSeconds(t);
    //     _labels.push(d.toLocaleString());
    //     _data.push(Number((1 / x[i].Rate).toFixed(8)));
    //   }
    // }
    // const ctx = document.getElementById('priceChart') as ChartItem;
    // //console.log(_data);
    // const myChart = new Chart(ctx, {
    //   type: 'line',
    //   data: {
    //     labels: _labels,
    //     datasets: [{
    //       label: this.tokenSymbol + ' price',
    //       data: _data,
    //       borderColor: 'rgb(75, 192, 192)',
    //       borderWidth: 1,
    //       tension: 0.1,
    //       fill: true,
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         ticks: {
    //           callback: function(value, index, values) {
    //               return Number(Number(value).toFixed(9));
    //           }
    //       }
    //       },
    //       x: {
    //         ticks: {
    //           autoSkip: true,
    //           maxTicksLimit: 0,
    //           display: false
    //         }
    //       }
    //     },
    //     plugins: {
    //       tooltip: {
    //         callbacks: {
    //             label: function(context) {
    //                 var label = context.dataset.label || '';
    //                 console.log("label",label);
    //                 if (label) {
    //                     label += ': ';
    //                 }
    //                 if (context.parsed.y !== null) {
    //                     label += context.parsed.y.toFixed(8);
    //                 }
    //                 return label;
    //             }
    //         }
    //     },
    //       legend: {
    //         display: true,
    //         labels: {
    //           boxWidth: 0
    //         },
    //         onClick: (e) => false
    //       }
    //     }
    //   }
    // });
  }
}
