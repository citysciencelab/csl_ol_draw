import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBarModule , MatTooltipModule, MatIconModule} from '@angular/material';
import { DragScrollModule } from 'ngx-drag-scroll';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {AppComponent } from './app.component';
import {MapDrawComponent } from './map-draw/map-draw.component';
import {AppRoutingModule} from './app-routing.module';
import {MapToIterable} from './pipes/MapToIterable';
import {StartComponent } from './start/start.component';
import {InfoscreenComponent } from './infoscreen/infoscreen.component';
import {LocalStorageService} from './local-storage/local-storage.service';

import {CircleMenuComponent} from './circle-menu/circle-menu.component';
import {StraightMenuComponent } from './straight-menu/straight-menu.component';
import {DragViewMenuComponent } from './drag-view-menu/drag-view-menu.component';

import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as wordcloud from 'highcharts/modules/wordcloud.src';
import {ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import {SpiderComponent} from './chart/spider/spider.component';
import {LineComponent} from './chart/line/line.component';
import {LayoutService} from './services/layoutservice';
import { CompareComponent } from './compare/compare.component';
import { HeightSliderComponent } from './height-slider/height-slider.component';
import {SocketServiceIO} from "./services/SocketServiceIO";
import {ChatService} from "./services/ChatService";
import {WebsocketService} from "./services/WebsocketService";
// import {LineComponent} from 'angular-dashboard-components/components/charts/line/line.component'

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
    LineComponent,
    CircleMenuComponent,
    StraightMenuComponent,
    DragViewMenuComponent,
    CompareComponent,
    HeightSliderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    DragScrollModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ChartModule
  ],
  exports: [
  ],
  providers: [
    LocalStorageService,
    LayoutService,
    SocketServiceIO,
    ChatService,
    WebsocketService,
    {provide: HIGHCHARTS_MODULES, useFactory: highchartsModules },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
