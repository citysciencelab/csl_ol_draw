import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapDrawComponent} from './map-draw/map-draw.component';
import {StartComponent} from './start/start.component';
import {InfoscreenComponent} from './infoscreen/infoscreen.component';
import {CompareComponent} from './compare/compare.component';

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component: StartComponent, data: { state: 'start' } },
  { path: 'draw', component: MapDrawComponent },
  // { path: 'draw', component: MapDrawComponent, data: { state: 'draw' } },
  { path: 'infoscreen', component: InfoscreenComponent},
  { path: 'compare', component: CompareComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
