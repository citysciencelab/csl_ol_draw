import {Component, OnInit, NgZone} from '@angular/core';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/Format/GeoJSON.js';
import {Style, Fill, Stroke, Circle} from 'ol/Style.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Overlay from 'ol/Overlay.js';
import {getArea, getLength} from 'ol/sphere.js';
import {LineString, Polygon} from 'ol/geom.js';

import {unByKey} from 'ol/Observable.js';
import {fromLonLat} from 'ol/proj.js';

import * as ol from 'ol';
import proj4 from 'proj4';

@Component({
  selector: 'app-map-draw',
  templateUrl: './map-draw.component.html',
  styleUrls: ['./map-draw.component.less']
})
export class MapDrawComponent implements OnInit {

  map: ol.Map = undefined;
  mapId: string;
  mapView;
  source = null;
  initialZoom = 16;
  savedData = '';

  interacting = null;
  drawing = null;

  selectedDrawOption = 'Polygon';
  selectedInteraction = 'draw';
  drawOptions = ['Point', 'LineString', 'Polygon', 'Circle', 'None'];
  interactions: string[] = ['draw', 'modify'];
  selectedAreaType = 'Gewerbe';
  areaCategories = ['Wohnen', 'Gewerbe', 'Industrie'];

  areaToSourceMap = {};
  areaSumMap = {};
  gewerbeFlaeche = 0;

  sketch;
  listener;
  measureTooltipElement;
  measureTooltip;

  constructor(private zone: NgZone) {
    this.mapId = 'olMap';
  }

  ngOnInit() {
    for (let category of this.areaCategories) {
      this.areaSumMap[category] = 0;
    }
    this.initMap();
  }

  initMap() {
    let grassbrook = [10.003393732087716, 53.532553758257485];

    this.mapView = new View({
      center: fromLonLat(grassbrook),
      zoom: this.initialZoom
    });

    let vectorWohnen = this.createAreaLayer('Wohnen', ['#90ee90', '#006400']);
    let vectorGewerbe = this.createAreaLayer('Gewerbe', ['#add8e6', '#0000ff']);
    let vectorindustrie = this.createAreaLayer('Industrie', ['#fafad2', '#ffff00']);

    let raster = new TileLayer({
      source: new OSM({
        'url': 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      })
    });

    this.map = new Map({
      target: this.mapId,
      layers: [
        raster, vectorGewerbe, vectorWohnen, vectorindustrie
      ],
      view: this.mapView
    });

    this.addInitialInteraction();
  }

  private createAreaLayer(areaName: string, colorSheme: string[]) {
    let source = new VectorSource({wrapX: false});

    let vector = new VectorLayer({
      source: source,
      opacity: 0.5,
      style: new Style({
        fill: new Fill({
          color: colorSheme[0],

        }),
        stroke: new Stroke({
          color: colorSheme[1],
          width: 1
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: colorSheme[0]
          })
        })
      })
    });

    this.areaToSourceMap[areaName] = source;
    return vector;
  }

  areaTypeSelect($event: any) {
    this.resetAndCreateDrawing();
  }

  toolSelect($event: any) {
    let value = $event.value;
    let selectId = $event.source.id;
    if (selectId == 'draw_options') {
      this.resetAndCreateDrawing();
    } else {
      if (this.interacting) {
        this.map.removeInteraction(this.interacting);
      }

      let interact = new Modify({
        source: this.source,
        type: value
      });
      this.map.addInteraction(interact);
      this.interacting = interact;
    }
  }

  private resetAndCreateDrawing() {
    if (this.drawing) {
      this.map.removeInteraction(this.drawing);
    }
    let draw = new Draw({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: this.selectedDrawOption
    });
    this.map.addInteraction(draw);
    this.drawing = draw;
    this.createTooltipAndInteractions(draw);
  }

  addInitialInteraction() {
    let draw = new Draw({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: 'Polygon'
    });
    this.map.addInteraction(draw);
    this.drawing = draw;
    this.createTooltipAndInteractions(draw);

    let interact = new Modify({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: 'modify'
    });
    this.map.addInteraction(interact);
    this.interacting = interact;
  }

  /*
  *   Data saving and clearing
  */

  clearMap() {
    for (let area of this.areaCategories) {
      this.areaToSourceMap[area].clear();
    }
    this.savedData = '';

    let elements: NodeListOf<Element> = document.getElementsByClassName('tooltip-static');
    for (let i = 0; i < elements.length; i++) {
      let obj = elements[i];
      obj.parentNode.removeChild(obj);
    }
  }

  saveData() {
    this.savedData = '';
    for (let area of this.areaCategories) {
      let format = new GeoJSON();
      this.savedData += format.writeFeatures(this.areaToSourceMap[area].getFeatures())
    }
  }

  /*
  *   Tooltip stuff
  */

  private createTooltipAndInteractions(draw) {
    this.createMeasureTooltip();
    draw.on('drawstart', this.drawStartHandler);
    draw.on('drawend', this.drawEndHandler);
  }

  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });

    this.map.addOverlay(this.measureTooltip);
  }

  drawStartHandler = (evt) => {
    this.sketch = evt.feature;
    this.listener = this.sketch.getGeometry().on('change', this.sketchChangeHandler);
  }

  drawEndHandler = (evt) => {
    this.zone.run(() => {
      this.areaSumMap[this.selectedAreaType] += Number(this.measureTooltipElement.value);
    });

    this.measureTooltipElement.className = 'tooltip tooltip-static';
    this.measureTooltip.setOffset([0, -7]);
    // unset sketch
    this.sketch = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    this.createMeasureTooltip();
    unByKey(this.listener);
  }

  sketchChangeHandler = (evt) => {
    let tooltipCoord = evt.coordinate;
    let geom = evt.target;
    let output;
    let value;
    if (geom instanceof Polygon) {
      output = this.formatArea(geom);
      value = getArea(geom);
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    }
    // else if (geom instanceof LineString) {
    //   output = formatLength(geom);
    //   tooltipCoord = geom.getLastCoordinate();
    // }
    this.measureTooltipElement.innerHTML = output;
    this.measureTooltipElement.value = value;
    this.measureTooltip.setPosition(tooltipCoord);
  }

  formatArea = (polygon) => {
    return this.getFormattedArea(getArea(polygon));
  };

  getFormattedArea(area: number):string {
    let output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  }
}
