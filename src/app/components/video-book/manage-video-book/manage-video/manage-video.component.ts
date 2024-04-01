import { Component, OnInit, Input, Inject,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '@core/domain-classes/book';
import { TranslationService } from '@core/services/translation.service';
import { VideoBookService } from '@core/services/video-book.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '@environments/environment';



@Component({
    selector: 'app-manage-video',
    templateUrl: 'manage-video.component.html',
    styleUrls:["../manage-video-book.component.scss"]
})

export class ManageVideoComponent extends BaseComponent implements OnInit {
    @Input() book:Book
    @Input() bookVideo:any;
    @ViewChild(PlyrComponent, { static: true })
    plyr: PlyrComponent;
    player: Plyr;
    videoSources: Plyr.Source[]
    bookVideoForm: UntypedFormGroup;
    isEditMode = false
    // bookVideo?:any;
    showPermission:boolean;
    blobData:any;

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    response:string;
    message:string;
    durationInSeconds = 5;
    maxFileSize = 50 * 1024 * 1024;
    URL:any;

    fileSelected: File;
    imgURL: any;

    constructor(
        @Inject('BASE_URL') baseUrl: string,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private fb: UntypedFormBuilder,
        private bookService:VideoBookService,
        private toastrService: ToastrService,
        private translationService:TranslationService
    ) { 
        super()
        this.URL = environment.apiUrl
        // this.URL="https://localhost:44472/"

    }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { book: Book }) => {
              if (data.book) {
                this.isEditMode = true;
                this.book = data.book;
                // this.getBookVideo();
                this.getVideoFile()
              } 
            });
            this.uploader = new FileUploader({ 
      
                url: this.URL+"api/videobook/UploadVideo",
                authToken: "Bearer "+localStorage.getItem("bearerToken"),
                additionalParameter:{
                  bookId:this.book.id,
                  vimeoId: this.bookVideo?.vimeoId,
                },
                // allowedFileType: ['mov'],
                
               })
              this.response = '';
         
          
              this.uploader.response.subscribe((res:any) => {
                const ret = JSON.parse(res);
                if(ret.id !="00000000-0000-0000-0000-000000000000"){
                  this.showPermission = true;
                  this.bookVideo = ret;
                //   this.bookVideoForm.patchValue(ret)
                  this.videoSources =[
                    {
                      src: ret.mediaFile,
                      // type:'video/mp4'
                    }
                  ]
                  
                 
                }
                
              },(err)=>{
                console.log("YÜKLEME HATASI",err)
              } );
     }

    
      

      getBookVideo(){
        this.bookService.getBookVideo(this.book.id).subscribe((resp:any)=>{
          if(resp.id!="00000000-0000-0000-0000-000000000000"){
            this.showPermission = true;
            // this.bookVideoForm.patchValue(resp)
            this.bookVideo = resp;
            this.videoSources =[
              {
                src: resp.mediaFile,
                type:'video/mp4'
              }
            ];
            // this.vimeoSources =[
            //   {
            //     src: resp.vimeoId,
            //     provider: 'vimeo',
            //   }]
          }
          else{
            this.toastrService.error("Henüz Video Eklenmemiş")
          }
        })
      }

      getVideoFile(){
        this.bookService.getVideoFile(this.book.id+".mp4")
        .subscribe(resp=>{
          console.log(resp);
          const blob = new Blob([resp]);
    
    
          const video = document.createElement('video');
          video.src = URL.createObjectURL(blob);
          this.blobData = video.src
    
          this.videoSources =[
            {
              src: this.blobData,
              type:'video/mp4'
            }
          ]

        })
      }

      played(event: Plyr.PlyrEvent) {
        console.log('played', event);
      }

      public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
      }

      fileEvent($event) {
        this.fileSelected = $event.target.files[0];
        if (!this.fileSelected) {
          return;
        }
        const mimeType = this.fileSelected.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(this.fileSelected);
        // tslint:disable-next-line: variable-name
        reader.onload = (_event) => {
          const formData = new FormData();
          formData.append(this.fileSelected.name, this.fileSelected,this.book.id);
          
          console.log(formData);
          
          this.bookService.addMedia(formData).subscribe(resp=>{
            this.imgURL = resp.data
            console.log(resp)
          })  
         
        }
      }
}