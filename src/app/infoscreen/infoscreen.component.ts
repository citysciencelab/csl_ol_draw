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
    this.spiderData =
      [{
        name: 'Angestrebte Fläche in m²',
        data: [500, 500, 500]
      }, {
        name: 'Aktuelle Fläche in m²',
        data: [0, 0, 0]
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
        let newData = Object.assign({}, this.spiderData);
        newData[0]["data"] = message.data;
        //TODO: Damit die changes detected werden, müssen wohl die beiden Dimensionen hadgecoded werden!
        //TODO: SimpleChanges im SpiderChart kümmert sich dann um beides!
        // ODERSO? https://stackoverflow.com/questions/42962394/angular-2-how-to-detect-changes-in-an-array-input-property

        this.spiderData = newData;
      });
    }

  }

}
