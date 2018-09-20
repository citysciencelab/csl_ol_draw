import {Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, AfterViewChecked} from '@angular/core';
import {Chart} from 'angular-highcharts';
import { Highcharts } from 'angular-highcharts';

@Component({
    selector: 'dash-spider',
    styles: [
        '.spiderHolder {height: 100%}'
    ],
    template: `<div [chart]="spiderChart" class="spiderHolder"  id="{{spiderId}}"></div>`
})
export class SpiderComponent implements OnChanges, OnInit, AfterViewChecked {


    /*
    *   To assure good height adjustation, please give the parent containers a 'height: 100%'
    */
    // spiderId = Math.random().toString(36).substring(2, 15);
    @Input() spiderId:string;

    // Titles
    @Input() chartTitle = '';
    @Input() chartSubTitle = '';
    @Input() chartTitleAlign = 'center';

    @Input() isShowYAxis = true;

    @Input() pointStart = null;

    @Input() legendEnabled = true;
    @Input() isColorByPoint = false;
    @Input() isExport = true;

    @Input() series;

    @Output() clickOutput = new EventEmitter<string []>();

    public spiderChart;

    constructor(private zone: NgZone) {
    }

    ngOnInit() {
        this.spiderChart = this.getSpiderChart(this.series);
    }

    ngAfterViewChecked() {
    }

    private getSpiderChart(series) {

        let data = (series instanceof Array ? series : [series]);

        return new Chart({
          chart: {
            polar: true,
            type: 'line'
          },

          exporting: {
            enabled: false
          },

          title: {
            text: 'Soll-ist-Vergleich',
            x: -80
          },

          pane: {
            size: '80%'
          },

          xAxis: {
            categories: ['Wohnen', 'Gewerbe', 'Industrie'],
            tickmarkPlacement: 'on',
            lineWidth: 0
          },

          yAxis: {
            lineWidth: 0,
            min: 0
          },

          tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
          },

          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
          },
          series: data
        });
    }

    public redrawChart(isReflow) {
        if (isReflow) {
            this.spiderChart.ref.reflow();
        } else {
            this.spiderChart = this.getSpiderChart(this.series);
        }
    }

    /*
    *   Selecting elements on charts or from the outside, will also alter the selected filter elements
    */

    chartClick = (event) => {
        this.clickOutput.emit(event);
    };


    ngOnChanges(changes: SimpleChanges) {
        if (changes['series'] && !changes['series'].firstChange) {
          console.log('changes')
            this.zone.run(() => {
                this.spiderChart = this.getSpiderChart(changes['series'].currentValue);
            });
        }
    }

}
