import {Injectable} from '@angular/core';
import {LayoutEntity} from '../entity/layout.entity';
import * as rxjs from 'rxjs/index';


@Injectable()
export class LayoutService {

  areaToSourceMapList = [];
  public mapPosition = new rxjs.BehaviorSubject({});

  constructor() {
  }

  addLayout(layout: LayoutEntity) {
    this.areaToSourceMapList.push(layout);
  }

  getLayouts() {
    return this.areaToSourceMapList;
  }

  restart() {
    this.areaToSourceMapList = null;
  }

}
