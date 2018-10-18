import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from "@angular/router";

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/Format/GeoJSON.js';
import {Style, Fill, Stroke, Circle} from 'ol/Style.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Move from 'ol/interaction/DragAndDrop.js';
import Translate from 'ol/interaction/Translate.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Overlay from 'ol/Overlay.js';
import {getArea, getLength} from 'ol/sphere.js';
import {LineString, Polygon} from 'ol/geom.js';

import {unByKey} from 'ol/Observable.js';
import {fromLonLat} from 'ol/proj.js';
import {toLonLat} from 'ol/proj.js';

import proj4 from 'proj4';
import {LocalStorageMessage} from "../local-storage/local-storage-message.model";
import {LocalStorageService} from "../local-storage/local-storage.service";

@Component({
  selector: 'app-map-draw',
  templateUrl: './map-draw.component.html',
  styleUrls: ['./map-draw.component.less']
})
export class MapDrawComponent implements OnInit {

  map: Map = undefined;
  mapId: string;
  mapView;
  source = null;
  initialZoom = 16;
  savedData = '';
  dataFor3D = '';

  interaction = null;

  selectedDrawOption = 'Polygon';
  drawOptions = ['Point', 'LineString', 'Polygon', 'Circle', 'None'];
  selectedInteraction = 'Draw';
  interactions = ['Draw', 'Modify', 'Delete', 'Move'];
  selectedAreaType = 'Gewerbe';
  areaCategories = ['Wohnen', 'Gewerbe', 'Industrie'];

  areaToSourceMap = {};
  areaSumMap = {};
  gewerbeFlaeche = 0;

  sketch;
  listener;
  measureTooltipElement;
  measureTooltip;

  deleteEvent;
  moveEvent;

  constructor(private localStorageService: LocalStorageService,
              private zone: NgZone,
              private router: Router) {
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

    this.selectedInteraction = 'Draw';
    this.addDrawInteraction();
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


  /*
  *   Interaction setting
  */

  /*
  *   Selecting elements on a filter will also add a chip & recalculate values
  */

  interactionFromMenu = function (selection: Object) {
    if (selection['action'] === 'DeleteAll') {
      this.clearMap();
    } else {
      let newEventObject = [];
      newEventObject['value'] = selection['action'];
      this.interactionSelect(newEventObject);
    }
  };

  interactionSelect($event: any) {
    let value = $event.value;

    if (this.interaction) {
      this.map.removeInteraction(this.interaction);
    }

    if (this.moveEvent) {
      this.map.un('singleclick', this.mapMoveHandler);
    } else if (this.deleteEvent) {
      this.map.un('singleclick', this.mapDeleteHandler);
    }

    if (value == 'Draw') {
      this.addDrawInteraction();
    } else if (value == 'Modify') {
      this.addModifyInteraction();
    } else if (value == 'Move') {
      this.addMoveInteraction();
    } else if (value == 'Delete') {
      this.addDeleteInteraction();
    }
  }

  geometrySelect($event: any) {
    if (this.interaction) {
      this.map.removeInteraction(this.interaction);
    }
    let draw = new Draw({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: this.selectedDrawOption
    });
    this.map.addInteraction(draw);
    this.interaction = draw;
    this.createTooltipAndInteractions(draw);
  }

  addDeleteInteraction() {
    this.deleteEvent = this.map.on('singleclick', this.mapDeleteHandler);
  }

  mapDeleteHandler = (evt) => {
    let features = evt.map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length > 0) {
      let src:VectorSource = this.areaToSourceMap[this.selectedAreaType];
      for (let feat of features) {
        src.removeFeature(feat);
      }
    }
    this.saveData();
  }

  addMoveInteraction() {
    this.moveEvent = this.map.on('singleclick', this.mapMoveHandler);
  }

  mapMoveHandler = (evt) => {
    let features = evt.map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length > 0) {
      let interact = new Translate({
        source: this.areaToSourceMap[this.selectedAreaType],
        target: features[0]
      });
      this.map.addInteraction(interact);
      this.interaction = interact;
    }
    this.saveData();
  }

  addModifyInteraction() {
    let interact = new Modify({
      source: this.areaToSourceMap[this.selectedAreaType]
    });
    this.map.addInteraction(interact);
    this.interaction = interact;
    // TODO: Hier noch einen Listener, der das Modify an die Map weitergibt ...
  }

  addDrawInteraction() {
    let draw = new Draw({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: this.selectedDrawOption
    });
    this.map.addInteraction(draw);
    this.interaction = draw;
    this.createTooltipAndInteractions(draw);
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
    this.saveData();
  }

  saveData() {
    console.log("Saving data");

    this.savedData = '';
    let savedDataNew = {};
    let tempData = [];
    let format = new GeoJSON();
    for (let area of this.areaCategories) {
      // this.savedData += format.writeFeatures(this.areaToSourceMap[area].getFeatures())
      for (let feature of this.areaToSourceMap[area].getFeatures()) {
        tempData.push(feature);
      }
    }

    this.savedData = format.writeFeatures(tempData);
    savedDataNew = JSON.parse(format.writeFeatures(tempData));
    for (let feat of savedDataNew["features"]) {
      for (let i = 0; i < feat["geometry"]["coordinates"][0].length; i++) {
        let geom = feat["geometry"]["coordinates"][0][i];
        feat["geometry"]["coordinates"][0][i] = toLonLat(geom);
        let prop = {isPart: false};
        feat["properties"] = prop;
      }
    }

    this.savedData = JSON.stringify(savedDataNew);

    const message2: LocalStorageMessage = {
      type: 'tool-new-buildings',
      data: savedDataNew
    };
    this.localStorageService.sendMessage(message2);
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
    // Removing the tooltip
    let staticToolTip = document.getElementsByClassName('tooltip-static')[0];
    staticToolTip.parentNode.removeChild(staticToolTip);

    // unset sketch
    this.sketch = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    this.createMeasureTooltip();
    unByKey(this.listener);

    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.saveData();
    }, 800);
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


  /*
  *   Tooltip stuff
  */

  goConfiguration() {
    this.router.navigate(['/start']);
  }
}
