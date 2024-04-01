import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { VimeoUploadService } from '../vimeo-upload-service';

@Component({
  selector: 'app-vimeo-upload',
  templateUrl: './vimeo-upload.component.html',
  styleUrls: ['./vimeo-upload.component.scss']
})
export class VimeoUploadComponent implements OnInit {

  @Input() lesson?:any;
  @Input() section?:any;
  @Output()
  newItemEvent = new EventEmitter<any>();
  

  videoCode:any;
  public vimeoUploadForm: FormGroup;
  private data: any;
  public uploadPercent;
  vimeoLink:string=""
  // Track upload status by tracking code
  // 0 - Not started
  // 1 - File chosen
  // 2 - Wrong file type
  // 3 - Uploading
  // 4 - Upload error
  // 5 - Upload complete
  public uploadStatus: Number = 0;

  constructor(
    private uploadControl: VimeoUploadService,
    // private bookService: VideoBookService
  ) { }

  ngOnInit(): void {

    console.log("Vimeo-Ders",this.lesson)
    console.log("Vimeo-Section",this.section)
    // Init Vimeo Data Form
    this.initVimeoForm();
    // Return Vimeo Link from API response
    this.uploadControl.vimeoLinkObs.subscribe(
      data => {
        this.vimeoLink = data;
        
        if(data){
          console.log("VimeoDATA",data)
          // this.updateVideo()
        }
      }, error => {
        throw new Error(error);
      }
    );
  }

  

  selectFile(event): void {
    this.uploadVimeoVideo(event.target.files);
  }


  uploadVimeoVideo(files: FileList): void {
    this.uploadStatus = 1;
    if (files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = files[0];
    const isAccepted = this.checkAllowedType(file.type);
    if (isAccepted) {
      this.uploadStatus = 1;
      const options = {
        token:environment.vimeoApiKey,
        url : 'nm/https://api.vimeo.com/me/videos',
        videoName: this.lesson.openedCourseRecords.title,
        videoDescription: this.lesson.openedCourseRecords.shortDescription
      };
      this.uploadControl.createVimeo(options, file.size)
        .pipe(
          map(data => this.data = data),
          switchMap(
            () => {
              this.videoCode = {
                url:this.data.link,
                path:this.data.uri.slice(8)
              } 
              this.uploadControl.updateVimeoLink(this.data.link);

              if (this.data.upload.size === file.size) {
                this.data.upload.upload_link
                console.log(this.data.upload.upload_link)
                return this.uploadControl.vimeoUpload("nm/"+this.data.upload.upload_link, file);
              } else {
                this.uploadStatus = 4;
              }
            }
          )
        ).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadPercent = Math.round(100 * event.loaded / event.total);
            this.uploadStatus = 3;
          } else if (event instanceof HttpResponse) {
            this.uploadStatus = 5;
            setTimeout(() => {
              this.uploadStatus = 0;
            }, 5000);
          }
        },
        (error) => {
          console.log('Upload Error:', error);
          this.uploadStatus = 4;
        }, () => {
          
          this.newItemEvent.emit(this.videoCode);
          console.log('Upload done');

          // this.uploadControl.getVideoDetail(this.videoCode.path).subscribe(resp=>{
          //   console.log(resp);
          // })

        }
      );
    } else {
      this.uploadStatus = 2;
    }
  }



  removeVimeo(){
    const options = {
      token:environment.vimeoApiKey,
      url : 'nm/https://api.vimeo.com/me/videos/793644812',
      videoName: this.lesson.openedCourseRecords.title,
      videoDescription: this.lesson.openedCourseRecords.shortDescription
    };


    this.uploadControl.removeVimeo(options,1).subscribe(resp=>{
      console.log(resp);
    })
  }
 

  initVimeoForm() {
    this.vimeoUploadForm = new FormGroup(
      {
        vimeoAPI: new FormControl('', [Validators.required]),
        vimeoVideoName: new FormControl('', [Validators.required]),
        vimeoVideoDescription: new FormControl('', [Validators.required])
      }
    );
  }

  allowUpload(): void {
    this.uploadStatus = 0;
  }

  checkAllowedType(filetype: string): boolean {
    const allowed = ['mov', 'wmv', 'avi', 'flv', 'mp4'];
    const videoType = filetype.split('/').pop();
    return allowed.includes(videoType);
  }

  getFormValue(selector: string) {
    return this.vimeoUploadForm.get(selector).value;
  }

}
