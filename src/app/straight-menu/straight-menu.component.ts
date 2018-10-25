import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-straight-menu',
  templateUrl: './straight-menu.component.html',
  styleUrls: ['./straight-menu.component.less']
})
export class StraightMenuComponent implements OnInit {

  @Output() newSelection = new EventEmitter<Object>();
  isDragging = false;

  constructor() { }

  ngOnInit() {
  }

  menuItemClick(interActionType: string, interActionValue: string) {
    // let selection: Object = [];
    // selection['action'] = interActionType;
    // selection['value'] = interActionValue;
    // this.newSelection.emit(selection);
  }

  onDragStart(evt) {
    this.isDragging = true;
  }

  onDragEnded(evt) {
    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.isDragging = false;
    }, 500);
  }

}
