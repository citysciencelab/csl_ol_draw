import { Component, OnInit, OnChanges, NgZone, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-image-results',
  templateUrl: './image-results.component.html',
  styleUrls: ['./image-results.component.less']
})
export class ImageResultsComponent implements OnChanges, OnInit {

  // @Input() _resultImages: object[] = [];
  @Input() resultImages: object[] = [];

  constructor() { }

  ngOnInit() {
  }

/**
  @Input()
  set resultImages(value: object[]) {
    if (value.length > 0) {
      this._resultImages = value ? value : null;
      console.log(`title is changed to ${value}`);
    }
  }

  get resultImages(): object[] {
    return this._resultImages;
  }


 **/
  ngOnChanges(changes: SimpleChanges) {
    // Put this in a utils class,  set the resultImages: object[] = []; in the map-draw and that is the input for this component
    if (changes['resultImages'] && !changes['resultImages'].firstChange) {
      console.log("change")
    }
  }

}
