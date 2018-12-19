import {Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {LayoutService} from '../services/layoutservice';
import {Router} from '@angular/router';
import {defaults as defaultControls, Control} from 'ol/control.js';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {fromLonLat} from 'ol/proj.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less']
})
export class CompareComponent implements OnInit, AfterViewInit {

  @ViewChild('nav') ds;

  savedLayouts = [];
  private grasbrook = [10.013643732087715, 53.532553758257485];
  private initialZoom = 14;
  // Doppelte Speicherung - DO NOT DO THIS
  areaCategories = ['Wohnen', 'Gewerbe', 'Industrie'];

  constructor(
    private router: Router,
    private layoutService: LayoutService) { }

  ngOnInit() {
    this.savedLayouts = this.layoutService.getLayouts();
  }


  ngAfterViewInit() {
    if (this.savedLayouts && this.savedLayouts.length > 0) {
      for (const layout of this.savedLayouts) {
        const mapView = new View({
          center: fromLonLat(this.grasbrook),
          zoom: this.initialZoom,
          rotation: 0
        });

        const raster = new TileLayer({
          source: new OSM({
            'url': 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })
        });

        const layers = [];
        layers.push(raster);
        for (const category of this.areaCategories) {
          const source = layout.mapData[category];
          if (source !== null) {
            const vector = new VectorLayer({
              source: source
            });
            layers.push(vector);
          }
        }

        const map = new Map({
          target: layout.title,
          layers: layers,
          controls: defaultControls({
            zoom: false,
          }),
          view: mapView
        });
      }
    }
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  goBack() {
    this.router.navigate(['/start']);
  }

}
