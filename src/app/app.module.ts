import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBar, MatTooltipModule, MatIconModule} from '@angular/material';

import {DragDropModule} from '@angular/cdk/drag-drop';
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
import {CircleMenuComponent} from "./circle-menu/circle-menu.component";
import { StraightMenuComponent } from './straight-menu/straight-menu.component';


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
    SpiderComponent,
    CircleMenuComponent,
    StraightMenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ChartModule
  ],
  exports: [
  ],
  providers: [
    LocalStorageService,
    {provide: HIGHCHARTS_MODULES, useFactory: highchartsModules },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
