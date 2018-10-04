import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
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
  private osmb;
  private glMap;

  // NOT hard coded!
  private areaCategories = ['Wohnen', 'Gewerbe', 'Industrie'];

  constructor(private localStorageService: LocalStorageService,
              private zone: NgZone) {
    this.createAndUpdateSpiderData(null, null);
  }

  private createAndUpdateSpiderData(ist: number[], soll: number[]) {
    return this.spiderData =
      [{
        name: 'Angestrebte Fläche in m²',
        data: ist ? ist : [500, 500, 500]
      }, {
        name: 'Aktuelle Fläche in m²',
        data: soll ? soll : [0, 0, 0]
      }];
  }

  ngOnInit() {
    this.localStorageService.registerMessageCallback(this.receiveMessage.bind(this));
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.glMap = new GLMap('map', {
      position: { latitude:53.532702, longitude:10.013888 },
      zoom: 16,
      minZoom: 12,
      maxZoom: 20,
      tilt: 50
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
    if (this.osmb) {
      this.glMap.removeLayer(this.osmb);
      this.osmb.destroy();
    }
    this.osmb = new OSMBuildings({
      baseURL: './OSMBuildings',
      minZoom: 15,
      maxZoom: 22
    }).addTo(this.glMap);

    // TODO: Einfarbiger background oder transparent???
    this.osmb.addMapTiles(
      'http://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png'
    );

    let dings = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[10.01198872288296,53.53368740580626],[10.01096352313834,53.53312058560661],[10.01096352313834,53.53312058560661],[10.01220329960415,53.53235536633815],[10.01198872288296,53.53368740580626]]]},"properties":{"isPart":false}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[10.013609970239484,53.53283717268587],[10.013109290350254,53.53187355441122],[10.013109290350254,53.53187355441122],[10.014301382954725,53.53178852835683],[10.01477822156812,53.53221365750548],[10.013609970239484,53.53283717268587]]]},"properties":{"isPart":false}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[10.005527578661711,53.535118593306095],[10.005503737385878,53.53497689381777],[10.009723746672533,53.53399915398603],[10.010748946417149,53.53399915398603],[10.010868155415663,53.534438431145475],[10.005527578661711,53.535118593306095]]]},"properties":{"isPart":false}}]}'
    if (jsonData)
      this.osmb.addGeoJSON(jsonData);


  }

  addBuildingsToMap(jsonData) {
    this.createBuildingsLayer(jsonData);
    //this.osmb.destroy();
    // this.osmb.addGeoJSONTiles(jsonData);
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
        let newData = this.createAndUpdateSpiderData(message.data.values, this.spiderData[1]["data"]);
        this.spiderData = newData;
      });
    } else if (message.type == 'tool-new-buildings') {
      this.zone.run(() => {
        this.addBuildingsToMap(message.data)
      });
    }

  }

}
