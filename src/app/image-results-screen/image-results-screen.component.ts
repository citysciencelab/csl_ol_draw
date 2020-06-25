import {Component, OnInit} from '@angular/core';
import {WebSocketConnector} from '../services/WebSocketConnector';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {LocalStorageMessage} from "../local-storage/local-storage-message.model";

@Component({
  selector: 'app-image-results-screen',
  templateUrl: './image-results-screen.component.html',
  styleUrls: ['./image-results-screen.component.less']
})
export class ImageResultsScreenComponent implements OnInit {

  imageResult: object[] = [];
  isImagesSent = false;

  constructor(private localStorageService: LocalStorageService,
              private chatService: WebSocketConnector) {
  }

  ngOnInit() {
    console.log('result screen init')
    // this.initRemote();
    this.localStorageService.registerMessageCallback(this.receiveMessage.bind(this));
  }


  receiveMessage(message: LocalStorageMessage) {
    switch (message.type) {
      case 'draw-sent': {
        console.log('images have been sent');
        this.isImagesSent = true;
        break;
      }
      case 'draw-image': {
        console.log('incoming results')
        this.createImageCollection(message.data);
        break;
      }
    }
  }

  initRemote() {
    this.chatService.messages.subscribe(msg => {
      console.log('msg received');
      this.createImageCollection(msg);
    });
  }

  createImageCollection(newImage: object) {
    if (newImage !== null && newImage.hasOwnProperty('imageResult') &&
      newImage.hasOwnProperty('cropTime') && newImage['cropTime'].endsWith('-1')) {
      console.log('image received');
      this.isImagesSent = false;

      if (newImage['imageResult'].indexOf('base64') === -1) {
        newImage['image'] = 'data:image/gif;base64,' + newImage['imageResult'];
      } else {
        newImage['image'] = newImage['imageResult'];
      }
      // const srcData: SafeResourceUrl = this.sanitizer.bypassSecurityTrustStyle(newImage['image']);
      // newImage['srcData'] = srcData['changingThisBreaksApplicationSecurity'];
      newImage['srcData'] = newImage['image'];
      delete newImage['image'];
      if (this.imageResult.length > 0) {
        const resultImage = this.imageResult[0];
        // for (const resultImage of this.imageResult) {
        if (resultImage.hasOwnProperty('cropTime') && newImage.hasOwnProperty('cropTime')) {
          const cropTime = resultImage['cropTime'];
          const imageTime = cropTime.substring(0, cropTime.indexOf('-'));
          if (!newImage['cropTime'].startsWith(imageTime)) {
            this.imageResult = [];
          }
          this.imageResult.push(newImage);
        } else {
          // whatever if no croptime
        }
        // }
      } else {
        this.imageResult.push(newImage);
      }
    } else if (newImage !== null && newImage.hasOwnProperty('image') ) {
      console.log('images have been sent');
      this.isImagesSent = true;
    }
  }
}
