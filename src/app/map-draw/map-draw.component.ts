import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Style, Fill, Stroke, Circle, Icon} from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import Select from 'ol/interaction/Select.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Move from 'ol/interaction/DragAndDrop.js';
import Translate from 'ol/interaction/Translate.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, XYZ, Vector as VectorSource} from 'ol/source.js';
import Overlay from 'ol/Overlay.js';
import {getArea, getLength} from 'ol/sphere.js';
import {LineString, Polygon} from 'ol/geom.js';
import {defaults as defaultControls, Control} from 'ol/control.js';
import {click} from 'ol/events/condition.js';

import {unByKey} from 'ol/Observable.js';
import {fromLonLat} from 'ol/proj.js';
import {toLonLat} from 'ol/proj.js';

import {LocalStorageMessage} from '../local-storage/local-storage-message.model';
import {LocalStorageService} from '../local-storage/local-storage.service';

// import * as FileSaver from 'file-saver';
import {LayoutService} from '../services/layoutservice';
import {LayoutEntity} from '../entity/layout.entity';
import {ChatService} from '../services/ChatService';

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
  initialZoom = 17;
  savedData = '';
  isDrag3d = false;

  // Height slider values
  currentHeight = 10;
  sliderTop = 0;
  sliderLeft = 0;
  sliderDisplay = false;
  heightFeature = {};

  savedDrafts = {};

  interaction = null;

  selectedDrawOption = 'Polygon';
  // drawOptions = ['Point', 'LineString', 'Polygon', 'Circle', 'None'];
  selectedInteraction = 'Draw';
  interactionSpecifics = '';
  // interactions = ['Draw', 'Modify', 'Delete', 'Move'];
  selectedAreaType = 'Commercial';
  areaCategories = ['Residential', 'Commercial', 'Industrial', 'Road'];

  areaToSourceMap = {};
  areaSumMap = {};

  sketch;
  listener;
  measureTooltipElement;
  measureTooltip;

  deleteEvent;
  createEvent;
  selectControl;

  livingStyle = {
    fillColor: '#ffffff',
    strokeColor: '#ffffff'
  };

  officeStyle = {
    fillColor: '#FA1414',
    strokeColor: '#FA1414'
  };

  industryStyle = {
    fillColor: '#55FE61',
    strokeColor: '#55FE61'
  };

  roadStyle = {
    fillColor: '#000000',
    strokeColor: '#000000'
  };


  constructor(private localStorageService: LocalStorageService,
              private chatService: ChatService,
              private layoutService: LayoutService,
              private zone: NgZone,
              private router: Router,
              public snackBar: MatSnackBar) {
    this.mapId = 'olMap';
  }

  ngOnInit() {
    for (const category of this.areaCategories) {
      this.areaSumMap[category] = 0;
    }
    this.initMap();
  }

  initMap() {
    const grasbrook = [10.013643732087715, 53.532553758257485];

    this.mapView = new View({
      center: fromLonLat(grasbrook),
      zoom: this.initialZoom,
      rotation: 0
    });

    const vectorResidential = this.createAreaLayer('Residential', [this.livingStyle['fillColor'], this.livingStyle['strokeColor']], 0);
    const vectorCommercial = this.createAreaLayer('Commercial', [this.officeStyle['fillColor'], this.officeStyle['strokeColor']], 1);
    const vectorIndustrial = this.createAreaLayer('Industrial', [this.industryStyle['fillColor'], this.industryStyle['strokeColor']], 2);
    const vectorRoads = this.createAreaLayer('Road', [this.roadStyle['fillColor'], this.roadStyle['strokeColor']], 3, 5);

    // Western: https://api.mapbox.com/styles/v1/csill/cjpwhwmb9128d2rojvp5ilpx6.html?fresh=true&title=copy
    // Mete: https://api.mapbox.com/styles/v1/meteboncukcu/ck74rfpnp07z01iqjzp0ranzq
    const raster = new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/meteboncukcu/ck74rfpnp07z01iqjzp0ranzq/tiles/256/{z}/{x}/{y}?access_token=' +
          'pk.eyJ1IjoibWV0ZWJvbmN1a2N1IiwiYSI6ImNrNjd5cm83bDFkb2kzcG83MHo0Ymtjam4ifQ.xcAWLWrwQ7Y18dAaWGVdpQ',
        crossOrigin: 'Anonymous'
      })
    })

    this.map = new Map({
      target: this.mapId,
      layers: [
        raster, vectorCommercial, vectorResidential, vectorIndustrial, vectorRoads
      ],
      controls: defaultControls({
        zoom: false,
      }),
      view: this.mapView
    });

    this.map.on('pointerdrag', this.mapMoveEndHandler);

    this.selectedInteraction = 'Draw';
    this.addDrawInteraction();
  }

  mapMoveEndHandler = (evt) => {
    if (this.isDrag3d) {
      const sendData = toLonLat(this.mapView.get('center'));
      sendData.push(this.mapView.get('rotation'));
      const message2: LocalStorageMessage = {
        type: 'tool-new-map-position',
        data: sendData
      };
      this.localStorageService.sendMessage(message2);
    }
  }


  private createAreaLayer(areaName: string, colorSheme: string[], zIndex, strokeWidth?: number) {
    const source = new VectorSource({wrapX: false});

    const vector = new VectorLayer({
      source: source,
      opacity: 1,
      zIndex: zIndex,
      style: new Style({
        fill: new Fill({
          color: colorSheme[0],

        }),
        stroke: new Stroke({
          color: colorSheme[1],
          width: strokeWidth ? strokeWidth : 1
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

  public getCurrenTypeColor(buildingType: string, colorType: string) {
    if (buildingType === 'Residential') {
      return this.livingStyle[colorType];
    } else if (buildingType === 'Commercial') {
      return this.officeStyle[colorType];
    } else if (buildingType === 'Industrial') {
      return this.industryStyle[colorType];
    } else if (buildingType === 'Road') {
      return this.roadStyle[colorType];
    }
  }


  /*
  *   Setting building type from menu
  */

  public setBuildingTpe(selection: string) {
    this.selectedAreaType = selection;
  }


  /*
  *   Setting 3D dragging from menu
  */

  public specialInfoView(menuOutput: Object[]) {
    switch (menuOutput[0]) {
      case 'drag': {
        this.isDrag3d = !this.isDrag3d;
        break;
      }
      case 'context': {
        this.startContextView();
        break;
      }
      case 'predefined': {
        const newEventObject = [];
        newEventObject['value'] = 'Predefined';
        this.interactionSelect(newEventObject);
        break;
      }
      case 'saveData': {
        // const blob = new Blob([this.savedData], {type: 'text/plain;charset=utf-8'});
        // FileSaver.saveAs(blob, 'planner-design' + new Date().getMilliseconds() + '.txt');
        break;
      }
      case 'favData': {
        const layout = new LayoutEntity();
        layout.title = 'Design ' + new Date().getMilliseconds();
        const clonedMAp = {};
        Object.keys(this.areaToSourceMap).map( key => {
          const src: VectorSource = this.areaToSourceMap[key];
          const cloneSrc = new VectorSource({wrapX: false});
          for (const featrue of src.getFeatures()) {
            cloneSrc.addFeature(featrue.clone());
          }
          clonedMAp[key] = cloneSrc;
        });
        layout.mapData = clonedMAp;
        this.layoutService.addLayout(layout);
        this.openSnackBar('Data saved for comparison');
        break;
      }
      case 'printMap': {
        this.exportMapImage();
        break;
      }
    }
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
      const newEventObject = [];
      newEventObject['value'] = selection['action'];
      if (selection['value']) {
        this.interactionSpecifics = selection['value'];
      }
      this.interactionSelect(newEventObject);
    }
  };

  interactionSelect($event: any) {
    const value = $event.value;

    if (this.interaction) {
      this.map.removeInteraction(this.interaction);
    }

    if (this.deleteEvent) {
      this.map.un('singleclick', this.mapDeleteHandler);
    }
    if (this.createEvent) {
      this.map.un('singleclick', this.mapCreateHandler);
    }

    switch (value) {
      case 'Draw': {
        this.addDrawInteraction();
        break;
      }
      case 'Modify': {
        this.addModifyInteraction();
        break;
      }
      case 'Move': {
        this.addMoveInteraction();
        break;
      }
      case 'Delete': {
        this.addDeleteInteraction();
        break;
      }
      case 'Select': {
        this.addSelectInteraction();
        break;
      }
      case 'Predefined': {
        this.addCreateInteraction();
        break;
      }
    }
  }

  addCreateInteraction() {
    this.createEvent = this.map.on('singleclick', this.mapCreateHandler);
  }

  mapCreateHandler = (evt) => {

    const src: VectorSource = this.areaToSourceMap[this.selectedAreaType];
    const coordinate = evt.coordinate;

    const iconFeature = new Feature({
      geometry: new Point(coordinate),
      name: 'Null Island',
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/qr/2.png'
      }))
    });

    iconFeature.setStyle(iconStyle);
    src.addFeature(iconFeature);
  }

  addSelectInteraction() {
    this.selectControl = new Select({
      condition: click
    });
    this.map.addInteraction(this.selectControl);
    this.interaction = this.selectControl;
    this.selectControl.on('select', this.mapSelectHandler);
  }

  mapSelectHandler = (evt) => {
    const features = evt.selected;
    if (features && features.length > 0) {
      if (this.interactionSpecifics === 'Type') {

        const newSrc: VectorSource = this.areaToSourceMap[this.selectedAreaType];
        const currentType = features[0].get('buildingType');
        const src: VectorSource = this.areaToSourceMap[currentType];

        for (const feat of features) {
          feat.set('buildingType', this.selectedAreaType);
          feat.set('color', this.getCurrenTypeColor(this.selectedAreaType, 'fillColor'));
          src.removeFeature(feat);
          newSrc.addFeature(feat);
        }
        src.dispatchEvent('change');
        newSrc.dispatchEvent('change');
      } else if (this.interactionSpecifics === 'Height') {
        for (const feat of features) {
          const height = feat.get('height') ? feat.get('height') : 4;
          if (height) {
            // const newHeight = parseInt(height) + 35;
            // feat.set('height', newHeight + '');
          } else {
            feat.set('height', '35');
          }

          this.heightFeature = feat;
          this.currentHeight = parseInt(height) / 4;
          this.sliderDisplay = true;
          this.sliderLeft = evt.mapBrowserEvent['pixel'][0];
          this.sliderTop = evt.mapBrowserEvent['pixel'][1];
        }
        this.map.on('click', this.mapClickHandler);
      }
      this.selectControl.getFeatures().clear();
    }
    this.saveData();
  }


  mapClickHandler = (evt) => {
    (this.heightFeature as Feature).set('height', this.currentHeight * 4);
    this.sliderDisplay = false;
    this.map.un('click', this.mapClickHandler);
    this.saveData();
  }

  addDeleteInteraction() {
    this.deleteEvent = this.map.on('singleclick', this.mapDeleteHandler);
  }

  mapDeleteHandler = (evt) => {
    const features = evt.map.getFeaturesAtPixel(evt.pixel);
    if (features && features.length > 0) {
      for (const areaCat of this.areaCategories) {
        const src: VectorSource = this.areaToSourceMap[areaCat];
        for (const feat of features) {
          if (src.hasFeature(feat)) {
            src.removeFeature(feat);
          }
        }
      }
    }
    this.saveData();
  }

  addMoveInteraction() {
    const interact = new Translate({
      source: this.areaToSourceMap[this.selectedAreaType]
    });
    interact.on('translateend', evt => {
      this.saveData();
    })
    this.map.addInteraction(interact);
    this.interaction = interact;
  }

  addModifyInteraction() {
    for (const area of this.areaCategories) {
      const interact = new Modify({
        source: this.areaToSourceMap[area]
      });
      interact.on('modifyend', evt => {
        this.saveData();
      })
      this.map.addInteraction(interact);
    }
  }

  addDrawInteraction() {
    const draw = new Draw({
      source: this.areaToSourceMap[this.selectedAreaType],
      type: this.selectedAreaType === 'Road' ? 'LineString' : this.selectedDrawOption
    });
    this.map.addInteraction(draw);
    this.interaction = draw;
    this.createTooltipAndInteractions(draw);
  }

  /*
  *   Data saving and clearing
  */

  clearMap() {
    for (const area of this.areaCategories) {
      this.areaToSourceMap[area].clear();
    }
    this.savedData = '';

    const elements: NodeListOf<Element> = document.getElementsByClassName('tooltip-static');
    for (let i = 0; i < elements.length; i++) {
      const obj = elements[i];
      obj.parentNode.removeChild(obj);
    }
    this.saveData();
  }

  saveData() {
    this.savedData = '';
    let savedDataNew = {};
    const tempData = [];
    const format = new GeoJSON();
    for (const area of this.areaCategories) {
      for (const feature of this.areaToSourceMap[area].getFeatures()) {
        tempData.push(feature);
      }
    }

    this.savedData = format.writeFeatures(tempData);
    savedDataNew = JSON.parse(format.writeFeatures(tempData));
    for (const feat of savedDataNew['features']) {
      for (let i = 0; i < feat['geometry']['coordinates'][0].length; i++) {
        const geom = feat['geometry']['coordinates'][0][i];
        feat['geometry']['coordinates'][0][i] = toLonLat(geom);
      }
    }

    this.savedData = JSON.stringify(savedDataNew);

    const message2: LocalStorageMessage = {
      type: 'tool-new-buildings-json',
      data: savedDataNew
    };
    this.localStorageService.sendMessage(message2);
  }

  /*
  *   Tooltip
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

    evt.feature.setProperties({isPart: false, buildingType: this.selectedAreaType, area: this.measureTooltipElement.value,
      color: this.getCurrenTypeColor(this.selectedAreaType, 'fillColor')});
    this.measureTooltipElement.className = 'tooltip tooltip-static';
    this.measureTooltip.setOffset([0, -7]);

    // Removing the tooltip
    const staticToolTip = document.getElementsByClassName('tooltip-static')[0];
    staticToolTip.parentNode.removeChild(staticToolTip);

    // unset sketch
    this.sketch = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    this.createMeasureTooltip();
    unByKey(this.listener);

    setTimeout(() => {
      this.saveData();
    }, 800);
  }

  sketchChangeHandler = (evt) => {
    let tooltipCoord = evt.coordinate;
    const geom = evt.target;
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
  }

  getFormattedArea(area: number): string {
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
  *   Navigation
  */

  goConfiguration() {
    this.router.navigate(['/start']);
  }



  /*
  *   Outside communication
  */

  startContextView() {
    const message2: LocalStorageMessage = {
      type: 'tool-context',
      data: null
    };
    this.localStorageService.sendMessage(message2);
  }



  /*
  *   Misc
  */

  openSnackBar(snackText) {
    this.snackBar.open(snackText, 'Saved', {
      duration: 2000,
    });
  }

  public setNewHeight(menuOutput: number) {
    this.currentHeight = menuOutput;
  }

  exportMapImage = () => {
    const that = this;
    this.map.once('rendercomplete', function() {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.setAttribute('crossorigin', 'anonymous');
      const size = this.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), function(canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const transform = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          const matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      });
      if (navigator.msSaveBlob) {
        // link download attribute does not work on MS browsers
        navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
      } else {
        const cropImageDim = 512;
        const imageArray: object[] = [];
        const numberOfCanvases = parseInt((mapCanvas.width / 512) + '', null);
        const borderLeft = (mapCanvas.width % 512) / 2;
        const borderTop = (mapCanvas.height % 512) / 2;
        const imageTime = Date.now();

        for (let i = 0; i < numberOfCanvases; i++) {
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = cropImageDim;
          cropCanvas.height = cropImageDim;
          const cropContext = cropCanvas.getContext('2d');
          cropContext.drawImage(mapCanvas, borderLeft + cropImageDim * i, borderTop
            , 512, 512, 0, 0, 512, 512);
          const lonLatTL = toLonLat(that.map.getCoordinateFromPixel([borderLeft + cropImageDim * i, borderTop]));
          const lonLatBR = toLonLat(that.map.getCoordinateFromPixel([cropImageDim + borderLeft + cropImageDim * i
            , cropImageDim + borderTop]));
          imageArray.push({'cropTime': imageTime + '-' + i, 'image': cropCanvas.toDataURL()
            , 'coordinatesTL': lonLatTL, 'coordinatesBR': lonLatBR});
        }

        for (const imageData of imageArray) {
          /** const link: HTMLElement = document.getElementById('image-download');
          link['href'] = cropImgString;
          link.click(); **/
        }
        that.sendDataArrayWithDelay(imageArray);
      }
    });
    this.map.renderSync();
  }

  /*
 *  Remote
 */

  async sendDataArrayWithDelay(imageArray) {
    console.log('Sending a total of: ' + imageArray.length + ' images');
    for (const imageData of imageArray) {
      console.log('picture sent');
      this.chatService.messages.next(imageData);
      await this.sleep(3000);
    }
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  sendData = (data) => {
    console.log('picture sent');
    this.chatService.messages.next(data);
  }

}
