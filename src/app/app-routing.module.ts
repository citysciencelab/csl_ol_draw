import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MapDrawComponent} from "./map-draw/map-draw.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'draw', component: MapDrawComponent }
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
