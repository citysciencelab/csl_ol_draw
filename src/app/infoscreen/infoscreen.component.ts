import { Component, OnInit, NgZone } from '@angular/core';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {LocalStorageMessage} from "../local-storage/local-storage-message.model";

@Component({
  selector: 'app-infoscreen',
  templateUrl: './infoscreen.component.html',
  styleUrls: ['./infoscreen.component.less']
})
export class InfoscreenComponent implements OnInit {

  public isToolStarted = true;
  private spiderData;

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
    }

  }

}
