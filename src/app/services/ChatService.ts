import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {WebsocketService} from './WebsocketService';

const CHAT_URL = 'ws://localhost:8080';

export interface Message {
  author: string;
  message: string;
}

@Injectable()
export class ChatService implements OnInit {
  public messages: Subject<Message>;

  constructor(private wsService: WebsocketService) {
    // https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/
    /**
     this.messages = this.wsService.connect(CHAT_URL).pipe(map(
     (response: MessageEvent): Message => {
        const data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message
        };
      }));
     */
  }

  ngOnInit() {
  }
}
