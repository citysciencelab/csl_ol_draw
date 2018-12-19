import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {LocalStorageMessage} from "../local-storage/local-storage-message.model";
import {LocalStorageService} from "../local-storage/local-storage.service";
import {Router} from "@angular/router";

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

  @Output() toolStart = new EventEmitter<string>();

  isStarted = false;
  menuState = 'active';
  topicState = 'inactive';
  slideState = 'noSelect';
  sliderValueLiving = 25000;
  sliderValueWorking = 25000;
  sliderValueIndustry = 25000;

  constructor(private localStorageService: LocalStorageService,
              private router: Router) { }

  ngOnInit() {
  }

  startTool() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.menuState = 'inactive';
      this.topicState = 'active';

      const message: LocalStorageMessage = {
        type: 'tool-interaction',
        data: { name: 'tool-start' }
      };
      this.localStorageService.sendMessage(message);
      this.toolStart.emit('tool-start');

    }
  }

  startTopic(topic) {
    this.topicState = 'inactive';
    this.slideState = 'isSelected';
  }

  setGoalsAndForward() {
    const message2: LocalStorageMessage = {
      type: 'tool-select-goals',
      data: { values: [this.sliderValueLiving, this.sliderValueWorking, this.sliderValueIndustry] }
    };
    this.localStorageService.sendMessage(message2);
    this.toolStart.emit('tool-select-goals');

    this.router.navigate(['/draw']);
  }

  goToComparison() {
    this.router.navigate(['/compare']);
  }

}
