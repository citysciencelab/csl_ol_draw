import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag-view-menu',
  templateUrl: './drag-view-menu.component.html',
  styleUrls: ['./drag-view-menu.component.less']
})
export class DragViewMenuComponent implements OnInit {

  isDragView = false;
  isContextView = false;
  @Output() menuOutput = new EventEmitter<Object[]>();

  constructor() { }

  ngOnInit() {
  }

  setIsDragView() {
    this.isDragView = !this.isDragView;
    this.menuOutput.emit(['drag' , this.isDragView]);
  }

  setIsContextView() {
    this.isContextView = !this.isContextView;
    this.menuOutput.emit(['context' , this.isContextView]);
  }

}
