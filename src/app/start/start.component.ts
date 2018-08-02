import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.less'],
  animations: [
    trigger('menuStart', [
      state('inactive', style({opacity: 0})),
      state('active', style({opacity: 1})),
      transition('active => inactive', animate('500ms ease-out'))
    ]),

    trigger('showTopic', [
      state('inactive', style({transform: 'translateX(0) scale(0)'})),
      state('active',   style({transform: 'translateX(0) scale(1.1)'})),
      transition('inactive => active', [
        style({transform: 'translateX(0) scale(0)'}),
        animate(1000)
      ]),
      transition('active => inactive', animate('500ms ease-out'))
    ]),

    trigger('topicStart', [
      state('noSelect', style({
        opacity: 0
      })),
      state('isSelected', style({
        opacity: 1
      })),
      transition('noSelect => isSelected', animate('1000ms ease-in')),
      transition('isSelected => noSelect', animate('1000ms ease-out'))
    ])
  ]
})
export class StartComponent implements OnInit {

  isStarted = false;
  menuState = 'active';
  topicState = 'inactive';
  slideState = 'noSelect';
  sliderValueLiving = 650;
  sliderValueWorking = 500;
  sliderValueIndustry = 350;

  constructor() { }

  startTool() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.menuState = 'inactive';
      this.topicState = 'active';
    }
  }

  startTopic(topic) {
    this.topicState = 'inactive';
    this.slideState = 'isSelected';
  }

  ngOnInit() {
  }

}
