import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {LocalStorageMessage} from "../local-storage/local-storage-message.model";

// declare let GLMap: any;
// import * as GLMap from '../../../testfiles/tests/OSMBuildings/OSMBuildings.js"';
// import * as osmxfrom from "../../../testfiles/tests/OSMBuildings/OSMBuildings.js";

@Component({
  selector: 'app-infoscreen',
  templateUrl: './infoscreen.component.html',
  styleUrls: ['./infoscreen.component.less']
})
export class InfoscreenComponent implements OnInit, AfterViewInit {

  public isToolStarted = true;
  private spiderData;
  private columnData;
  private osmb;
  private gJson;
  private glMap;

  areaSumMap = {};
  savedData = '';

  // NOT hard coded!
  private areaCategories = ['Wohnen', 'Gewerbe', 'Industrie'];

  constructor(private localStorageService: LocalStorageService,
              private zone: NgZone) {
    this.createAndUpdateSpiderData(null, null);

    this.createBarData(this.spiderData[0]['data']);
  }

  private createAndUpdateSpiderData(ist: number[], soll: number[]) {
    // The array order is: 'Living', 'Office', 'Industrie' or ('Living, Office, Industry')
    return this.spiderData =
      [{
        name: 'Aktuelle Fläche in m²',
        data: ist ? ist : [0, 0, 0],
        color: '#7cb5ec'
      }, {
        name: 'Angestrebte Fläche in m²',
        data: soll ? soll : [25000, 25000, 25000],
        color: '#FF8000'
      }];
  }

  ngOnInit() {
    this.localStorageService.registerMessageCallback(this.receiveMessage.bind(this));
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    let grasbrook = [10.013643732087715, 53.532553758257485];

    this.glMap = new GLMap('map', {
      position: {latitude: grasbrook[1], longitude: grasbrook[0]},
      zoom: 17,
      minZoom: 12,
      maxZoom: 20,
      tilt: 50,
      rotation: 0
    });

    this.createBuildingsLayer(null);

    // this.osmb.addGeoJSONTiles('./assets/testdata/comparedata.json');
    //osmb.addGeoJSONTiles('./assets/testdata/data.json');
    // osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

    //***************************************************************************

    /*
    map.on('pointermove', function(e) {
      let id = this.osmb.getTarget(e.x, e.y);
      if (id) {
        document.body.style.cursor = 'pointer';
        this.osmb.highlight(id, '#f08000');
      } else {
        document.body.style.cursor = 'default';
        this.osmb.highlight(null);
      }
    });
    */

    //***************************************************************************

    // let controlButtons = document.querySelectorAll('.control button');
    //
    // for (let i = 0, il = controlButtons.length; i < il; i++) {
    //   controlButtons[i].addEventListener('click', function(e) {
    //     let button = this;
    //     let parentClassList = button.parentNode.classList;
    //     let direction = button.classList.contains('inc') ? 1 : -1;
    //     let increment;
    //     let property;
    //
    //     if (parentClassList.contains('tilt')) {
    //       property = 'Tilt';
    //       increment = direction*10;
    //     }
    //     if (parentClassList.contains('rotation')) {
    //       property = 'Rotation';
    //       increment = direction*10;
    //     }
    //     if (parentClassList.contains('zoom')) {
    //       property = 'Zoom';
    //       increment = direction*1;
    //     }
    //     if (property) {
    //       map['set'+ property](map['get'+ property]()+increment);
    //     }
    //   });
    // }
  }

  createBuildingsLayer(jsonData) {
    if (this.gJson) {
      this.gJson.destroy();
    }

    if (!this.osmb) {
      this.osmb = new OSMBuildings({
        baseURL: './OSMBuildings',
        minZoom: 15,
        maxZoom: 22
      }).addTo(this.glMap);

      this.osmb.addMapTiles(
        'http://{s}.basemaps.cartocdn.com/spotify_dark/{z}/{x}/{y}.png'
      );
      // this.osmb.addMapTiles(
      //   'http://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png'
      // );
    }

    if (jsonData) {
      this.savedData = JSON.stringify(jsonData);
      this.gJson = this.osmb.addGeoJSON(jsonData);
    }
  }

  processBuildingData(jsonData) {
    this.createBuildingsLayer(jsonData);

    let ist: number[] = [0, 0, 0];
    for (let feature of jsonData['features']) {
      if (feature['properties']['buildingType'] === 'Wohnen') {
        ist[0] += feature['properties']['area'];
      } else if (feature['properties']['buildingType'] === 'Gewerbe') {
        ist[1] += feature['properties']['area'];
      } else if (feature['properties']['buildingType'] === 'Industry') {
        ist[2] += feature['properties']['area'];
      }
    }

    this.createBarData(ist);
    this.createAndUpdateSpiderData(ist, this.spiderData[1]["data"]);
  }

  createBarData(ist: number[]) {
    this.columnData = [{
      name: 'Aktuelle Bebauung',
      data: [ist[0], ist[1], ist[2]]
    }];
  }

  receiveMessage(message: LocalStorageMessage) {
    if (message.type == 'tool-interaction') {
      switch (message.data.name) {
        case 'tool-start':
          this.isToolStarted = true;
          break;
        case 'tool-reset':
          this.isToolStarted = false;
          break;
      }
    } else if (message.type == 'tool-select-goals') {
      this.zone.run(() => {
        let newData = this.createAndUpdateSpiderData(this.spiderData[0]["data"], message.data.values);
        this.spiderData = newData;
      });
    } else if (message.type == 'tool-new-buildings-json') {
      this.zone.run(() => {
        this.processBuildingData(message.data)
      });
    } else if (message.type == 'tool-new-map-position') {
      let currentPositon = this.glMap.getRotation();
      if (currentPositon['latitude'] != message.data[1] || currentPositon['longitude'] != message.data[0]) {
        this.glMap['position'] = {latitude: message.data[1], longitude: message.data[0]};
      }

      let currentRotation = this.glMap.getRotation();
      let degree = this.radians_to_degrees(message.data[2]);
      if (degree != currentRotation) {
        this.glMap.setRotation(degree);
      }
    }

  }

  radians_to_degrees(radians) {
    let pi = Math.PI;
    return radians * (180 / pi);
  }


}
