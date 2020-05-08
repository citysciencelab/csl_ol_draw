import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// import * as socketIo from 'socket.io-client';

// const SERVER_URL = 'ws://powerful-coast-24873.herokuapp.com/';

import * as autobahn from 'autobahn';


@Injectable()
export class SocketServiceIO {
  // private wsuri = 'ws://csl.local.hcuhh.de:8081/ws';
  private wsuri = 'ws://localhost:8080';
  private realm = '';

  observable: Observable<string[]>;
  observer: Observer<string[]>;

  public initSocket(): Observable<string[]> {
    let locObserver: Observer<string[]> = null;

    this.observable = new Observable((observer: Observer<string[]>) => {
      this.observer = observer;
      locObserver = this.observer;
    });
    const connection = new autobahn.Connection({url: this.wsuri, realm: this.realm});
    connection.onopen = function (session, details) {
      console.log('Connected');

      function onevent(args) {
        console.log('Data received: ', args[0]);
        locObserver.next(args);
      }

      session.subscribe('hcu.csl.cosi', onevent).then(
        function (sub) {
          console.log('subscribed to topic hcu.csl.cosi');
        },
        function (err) {
          console.log('failed to subscribed: ' + err);
        }
      );
    };

    connection.open();
    return this.observable;
  }

}
