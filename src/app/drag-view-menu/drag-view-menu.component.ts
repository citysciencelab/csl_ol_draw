import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag-view-menu',
  templateUrl: './drag-view-menu.component.html',
  styleUrls: ['./drag-view-menu.component.less']
})
export class DragViewMenuComponent implements OnInit {

  isDragView = false;
  @Output() drag3DView = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  setIsDragView() {
    this.isDragView = !this.isDragView;
    this.drag3DView.emit(this.isDragView);
  }

}
