import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-height-slider',
  templateUrl: './height-slider.component.html',
  styleUrls: ['./height-slider.component.less']
})
export class HeightSliderComponent implements OnInit {

  @Input() currentHeight = 10;
  @Output() heightOutput = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  onInputChange(event: any) {
    this.heightOutput.emit(event.value);
  }
}
