// import { Component, OnInit,Inject  } from '@angular/core';
// import { DOCUMENT } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

// import { ZoomMtg } from '@zoomus/websdk';
// import { environment } from '@environments/environment';

// ZoomMtg.setZoomJSLib('https://source.zoom.us/2.12.2/lib', '/av');

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// // loads language files, also passes any error messages to the ui
// ZoomMtg.i18n.load('en-US');
// ZoomMtg.i18n.reload('en-US');


// @Component({
//     selector: 'app-virtual-class',
//     templateUrl: 'virtual-class.component.html',
//     styleUrls:['./virtual-class.component.scss']
// })

// export class VirtualClassComponent implements OnInit {
//     constructor(
//         public httpClient: HttpClient, 
//         @Inject(DOCUMENT) document) { }

//     ngOnInit() { }

//     getSignature() {
//         this.httpClient.post(environment.zoom.authEndpoint, {
//             meetingNumber: environment.zoom.meetingNumber,
//             role: environment.zoom.role
//         }).toPromise().then((data: any) => {
//           if(data.signature) {
//             console.log(data.signature)
//             this.startMeeting(data.signature)
//           } else {
//             console.log(data)
//           }
//         }).catch((error) => {
//           console.log(error)
//         })
//       }

//       startMeeting(signature) {

//         document.getElementById('zmmtg-root').style.display = 'block'
    
//         ZoomMtg.init({
//           leaveUrl: environment.zoom.leaveUrl,
//           success: (success) => {
//           },
//           error: (error) => {
//             console.log(error)
//           }
//         })
//       }
// }