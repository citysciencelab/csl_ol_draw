import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-circle-menu',
  templateUrl: './circle-menu.component.html',
  styleUrls: ['./circle-menu.component.less']
})
export class CircleMenuComponent implements OnInit {

  @Output() newSelection = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() {
  }

  menuItemClick(interActionType: string, interActionValue: string) {
    let selection: Object = [];
    selection['action'] = interActionType;
    selection['value'] = interActionValue;
    this.newSelection.emit(selection);
  }


  /*
      TODO: On Drag Start - den Mouse Release button unterdrücken!!!
  */

}
