import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-circle-menu',
  templateUrl: './circle-menu.component.html',
  styleUrls: ['./circle-menu.component.less']
})
export class CircleMenuComponent implements OnInit {

  @Output() newSelection = new EventEmitter<Object>();
  @Output() newBuildingTypeSelection = new EventEmitter<string>();
  isDragging = false;
  isMenuOpen = true;
  selectedAction = 'DrawPolygon';
  selectedActionData: Object = {action : 'Draw', value : 'Polygon'};
  previousAction;

  constructor() { }

  ngOnInit() {
  }

  menuItemClick(interActionType: string, interActionValue?: string) {
    if (interActionType === 'DeleteAll') {
      const selection: Object = [];
      selection['action'] = interActionType;
      this.newSelection.emit(selection);

      this.selectedAction = 'DrawPolygon';
      this.selectedActionData = {action : 'Draw', value : 'Polygon'};
      this.newSelection.emit(this.selectedActionData);
    } else {
      const selection: Object = [];
      selection['action'] = interActionType;
      selection['value'] = interActionValue;

      if (selection['action'] === 'Select' && selection['value'] === 'Type' &&
        selection['action'] !== 'Delete') {
        this.previousAction = this.selectedActionData;
      }

      this.newSelection.emit(selection);
      this.selectedActionData = selection;
      this.selectedAction = interActionType + (interActionValue ? interActionValue : '');
    }
  }

  onDragStart(evt) {
    this.isDragging = true;
  }

  setBuildingTpe(selection: string) {
    this.newBuildingTypeSelection.emit(selection);
    if (this.previousAction) {
      this.newSelection.emit(this.previousAction);
      this.selectedActionData = this.previousAction;
      this.selectedAction = this.previousAction['action'] + (this.previousAction['value'] ? this.previousAction['value'] : '');
    }
  }

  onDragEnded(evt) {
    setTimeout(() => {
      this.isDragging = false;
    }, 500);
  }
}
