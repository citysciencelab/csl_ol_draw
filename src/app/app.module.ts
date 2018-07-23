import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatRadioModule, MatSelectModule} from '@angular/material';

import {AppComponent } from './app.component';
import {MapDrawComponent } from './map-draw/map-draw.component';
import {AppRoutingModule} from "./app-routing.module";
import {MapToIterable} from "./pipes/MapToIterable";


@NgModule({
  declarations: [
    AppComponent,
    MapDrawComponent,
    MapToIterable
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
