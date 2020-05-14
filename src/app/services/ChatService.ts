import {Injectable, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {WebsocketService} from './WebsocketService';

const CHAT_URL = 'ws://fierce-dawn-73363.herokuapp.com';
// For local testing
// const CHAT_URL = 'ws://localhost:8080';

@Injectable()
export class ChatService implements OnInit {
  public messages: Subject<object>;

  constructor(private wsService: WebsocketService) {
    // https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/

    this.messages = <Subject<object>>this.wsService.connect(CHAT_URL).pipe(map(
      (response: MessageEvent): object => {
          return JSON.parse(response.data);
      }));
  }

  ngOnInit() {
  }
}
