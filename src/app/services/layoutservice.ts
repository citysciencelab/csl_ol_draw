import {Injectable} from '@angular/core';
import {LayoutEntity} from '../entity/layout.entity';


@Injectable()
export class LayoutService {

  areaToSourceMapList = [];

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
