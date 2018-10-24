import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-circle-menu',
  templateUrl: './circle-menu.component.html',
  styleUrls: ['./circle-menu.component.less']
})
export class CircleMenuComponent implements OnInit {

  @Output() newSelection = new EventEmitter<Object>();
  isDragging = true;

  constructor() { }

  ngOnInit() {
  }

  menuItemClick(interActionType: string, interActionValue: string) {
    let selection: Object = [];
    selection['action'] = interActionType;
    selection['value'] = interActionValue;
    this.newSelection.emit(selection);
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
