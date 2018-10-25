import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-straight-menu',
  templateUrl: './straight-menu.component.html',
  styleUrls: ['./straight-menu.component.less']
})
export class StraightMenuComponent implements OnInit {

  @Output() newSelection = new EventEmitter<string>();
  isDragging = false;
  @Input() selectedType;

  constructor() { }

  ngOnInit() {
  }

  setBuildingType(buildingType: string) {
    this.newSelection.emit(buildingType);
    this.selectedType = buildingType;
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
