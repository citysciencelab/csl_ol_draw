import { Injectable } from '@angular/core';
import { LocalStorageMessage } from './local-storage-message.model';

@Injectable()
export class LocalStorageService {

  constructor() { }

  sendMessage(message: LocalStorageMessage) {
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.removeItem('message');

    console.log(localStorage.length)
  }

  registerMessageCallback(callback: (LocalStorageMessage) => void) {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key !== 'message') {
        return;
      }
      const message = <LocalStorageMessage>JSON.parse(event.newValue);
      if (!message) {
        return;
      }
      callback(message);
    });
  }
}
