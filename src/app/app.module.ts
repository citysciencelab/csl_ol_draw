import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBar} from '@angular/material';

import {AppComponent } from './app.component';
import {MapDrawComponent } from './map-draw/map-draw.component';
import {AppRoutingModule} from "./app-routing.module";
import {MapToIterable} from "./pipes/MapToIterable";
import {StartComponent } from './start/start.component';
import {InfoscreenComponent } from './infoscreen/infoscreen.component';
import {LocalStorageService} from "./local-storage/local-storage.service";

import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as wordcloud from 'highcharts/modules/wordcloud.src';
import {ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import {SpiderComponent} from "./chart/spider/spider.component";


export function highchartsModules() {
  return [ more, exporting, wordcloud];
}

@NgModule({
  declarations: [
    AppComponent,
    MapDrawComponent,
    MapToIterable,
    StartComponent,
    InfoscreenComponent,
    SpiderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    FormsModule,
    ChartModule
  ],
  providers: [
    LocalStorageService,
    {provide: HIGHCHARTS_MODULES, useFactory: highchartsModules },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
