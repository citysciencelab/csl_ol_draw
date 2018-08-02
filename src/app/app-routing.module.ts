import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapDrawComponent} from "./map-draw/map-draw.component";
import {StartComponent} from "./start/start.component";

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component: StartComponent, data: { state: 'start' } },
  { path: 'draw', component: MapDrawComponent, data: { state: 'draw' } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
