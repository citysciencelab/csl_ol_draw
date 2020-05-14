import {Component, OnInit} from '@angular/core';
import {ChatService} from '../services/ChatService';

@Component({
  selector: 'app-image-results-screen',
  templateUrl: './image-results-screen.component.html',
  styleUrls: ['./image-results-screen.component.less']
})
export class ImageResultsScreenComponent implements OnInit {

  imageResult: object[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.initRemote();
  }

  initRemote() {
    this.chatService.messages.subscribe(msg => {
      this.createImageCollection(msg);
    });
  }

  createImageCollection(newImage: object) {
    if (newImage !== null) {
      if (newImage['image'].indexOf('base64') === -1) {
        newImage['image'] = 'data:image/gif;base64,' + newImage['resultImage'];
      }
      // const srcData: SafeResourceUrl = this.sanitizer.bypassSecurityTrustStyle(newImage['image']);
      // newImage['srcData'] = srcData['changingThisBreaksApplicationSecurity'];
      newImage['srcData'] = newImage['image'];
      delete newImage['image'];
      if (this.imageResult.length > 0) {
        const resultImage = this.imageResult[0];
        // for (const resultImage of this.imageResult) {
        if (resultImage.hasOwnProperty('cropTime') && newImage.hasOwnProperty('cropTime')) {
          if (resultImage['cropTime'] !== newImage['cropTime']) {
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
    }
  }
}
