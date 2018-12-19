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

  constructor() { }

  ngOnInit() {
  }

  menuItemClick(interActionType: string, interActionValue: string) {
    // TODO: Wenn hier auf delete all geklickt wird muss sofort auf zeichnen zurück gegangen werden
    const selection: Object = [];
    selection['action'] = interActionType;
    selection['value'] = interActionValue;
    this.newSelection.emit(selection);
    this.selectedAction = interActionType + (interActionValue ? interActionValue : '');
  }

  onDragStart(evt) {
    this.isDragging = true;
  }

  setBuildingTpe(selection: string) {
    this.newBuildingTypeSelection.emit(selection);
  }

  onDragEnded(evt) {
    setTimeout(() => {
      this.isDragging = false;
    }, 500);
  }
}
