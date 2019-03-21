import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  AfterViewChecked
} from '@angular/core';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-dash-line',
  styles: [
    '.lineHolder {height: 350px}'
  ],
  template: `<div [chart]="lineChart" class="lineHolder"  id="{{lineId}}"></div>`
})
export class LineComponent implements OnChanges, OnInit, AfterViewChecked {


  /*
  *   To assure good height adjustation, please give the parent containers a 'height: 100%'
  */
  // lineId = Math.random().toString(36).substring(2, 15);
  @Input() lineId = '';

  // Titles
  @Input() chartTitle = '';
  @Input() chartSubTitle = '';
  @Input() chartTitleAlign = 'center';

  // Column or line as type
  @Input() chartType = 'line';
  @Input() yTitle = '';
  @Input() xTitle = '';
  @Input() isShowYAxis = true;

  @Input() pointStart = null;

  @Input() legendEnabled = true;
  @Input() isColorByPoint = false;
  @Input() isExport = true;

  @Input() plotLineValue;
  @Input() isNoGridLines = false;

  // E.G.: xCategories ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  @Input() xCategories = [];

  // E.G. Series:
  // [{name: 'Series1', data:[29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]},
  // {name: 'Series2', data:[216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]}]
  @Input() series;

  @Output() clickOutput = new EventEmitter<string []>();

  public lineChart;

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.lineChart = this.getLineChart(this.series, this.xCategories);
  }

  ngAfterViewChecked() {
  }

  private getLineChart(series, categories) {
    series['colorByPoint'] = this.isColorByPoint;
    const data = (series instanceof Array ? series : [series]);
    const renderTo: any = document.getElementById(this.lineId);

    return new Chart({
      chart: {
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        type: this.chartType,
        renderTo: renderTo
      },
      exporting: {
        enabled: this.isExport,
        buttons: {
          contextButton: {
            enabled: true
          },
        },
      },
      title: {
        text: this.chartTitle,
        align: this.chartTitleAlign
      },
      subtitle: {
        text: this.chartSubTitle
      },
      yAxis: {
        visible: this.isShowYAxis,
        title: {
          text: this.yTitle
        },
        gridLineWidth: this.isNoGridLines ? 0 : 1,
        lineWidth: this.isNoGridLines ? 0 : 1,
        plotLines: [{
          color: '#FF0000',
          width: this.plotLineValue ? 2 : 0,
          value: this.plotLineValue ? this.plotLineValue : null
        }]
      },
      xAxis: {
        categories: categories,
        title: {
          text: this.yTitle
        },
        labels: {
          autoRotationLimit: 0
        },
        tickWidth: this.isNoGridLines ? 0 : 1,
        lineWidth: this.isNoGridLines ? 0 : 1
      },
      legend: {
        enabled: this.legendEnabled,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        bar: {
          colorByPoint: (this.isColorByPoint && this.chartType === 'bar')
        },
        series: {
          cursor: 'pointer',
          events: {
            click: this.chartClick,
          },
        },
      },
      series: data
    });
  }

  public redrawChart(isReflow) {
    if (isReflow) {
      this.lineChart.ref.reflow();
    } else {
      this.lineChart = this.getLineChart(this.series, this.xCategories);
    }
  }

  /*
  *   Selecting elements on charts or from the outside, will also alter the selected filter elements
  */

  chartClick = (event) => {
    this.clickOutput.emit(event);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['series'] && !changes['series'].firstChange) {
      this.zone.run(() => {
        this.lineChart = this.getLineChart(changes['series'].currentValue, this.xCategories);
      });
    }
  }

}
