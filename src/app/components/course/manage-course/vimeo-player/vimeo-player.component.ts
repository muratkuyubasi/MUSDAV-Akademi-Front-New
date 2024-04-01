import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { PlyrComponent } from 'ngx-plyr';


@Component({
    selector: 'app-vimeo-player',
    templateUrl: 'vimeo-player.component.html'
})

export class VimeoPlayerComponent implements OnInit {

    @ViewChild(PlyrComponent)
    plyr: PlyrComponent;
  
    // or get it from plyrInit event
    player: Plyr;

    @Input() videoSrc?:string="";

  
    vimeoVideoSource: Plyr.Source[] = [];


    constructor() { }

    ngOnInit() {

        const test = "/videos/823298829"
        // console.log("Şuradaki DATA",test.slice(8));
        this.vimeoVideoSource=[ {
            src: this.videoSrc,
            provider: 'vimeo',
          }]
          
        
     }

    played(event: Plyr.PlyrEvent) {
        console.log('played', event);
      }
    
      play(): void {
        this.player.play(); // or this.plyr.player.play()
      }
    
      stop(): void {
        this.player.stop(); // or this.plyr.player.play()
      }
}