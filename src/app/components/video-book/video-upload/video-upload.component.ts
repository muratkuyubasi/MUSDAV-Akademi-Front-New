import { Component, Inject, OnInit,ViewChild, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '@core/domain-classes/book';
import { Author,Contribute } from '@core/domain-classes/book-author';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';
import { VideoBookService } from '@core/services/video-book.service';
import { FileUploader } from 'ng2-file-upload';

import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { SafePipe } from '../../../safe.pipe';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css'],
  providers:[SafePipe]
})
export class VideoUploadComponent extends BaseComponent implements OnInit {
  @ViewChild(PlyrComponent, { static: true })
  plyr: PlyrComponent;
  player: Plyr;
  videoSources: Plyr.Source[]
  vimeoSources = [];
  book: Book;
  bookVideoForm: UntypedFormGroup;
  isEditMode = false;
  bookVideo?:any;
  showPermission:boolean;
  // uploader:FileUploader;

  response:string;
  message:string;
  durationInSeconds = 5;
  maxFileSize = 50 * 1024 * 1024;
  URL:any;

  blobData:any;

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;


  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private fb: UntypedFormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private bookService: VideoBookService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private translationService:TranslationService) {
    super();
    this.URL = environment.apiUrl
     this.createBookVideoForm()

     
       
  }

  ngOnInit(): void {
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { book: Book }) => {
        console.log(data)
        if (data.book) {
          this.isEditMode = true;
          this.book = data.book;
          this.getBookVideo();
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
        console.log(res)
        const ret = JSON.parse(res);
        if(ret.id !="00000000-0000-0000-0000-000000000000"){
          this.showPermission = true;
          this.bookVideo = ret;
          this.bookVideoForm.patchValue(ret)
          this.videoSources =[
            {
              src: ret.mediaFile,
              // type:'video/mp4'
            }
          ]
          
          this.vimeoSources =[
            {
              src: ret.vimeoId,
              provider: 'vimeo',
            },]
          console.log(this.bookVideo)
        }
        
      } );
  }

  getVideoFile(){
    this.bookService.getVideoFile(this.book.id+".mp4")
    .subscribe(resp=>{
      console.log("KİTAPVİDEO",resp)
      const blob = new Blob([resp]);
      console.log(blob);


      const video = document.createElement('video');
      video.src = URL.createObjectURL(blob);
      console.log(video.src)
      this.blobData = video.src

      this.videoSources =[
        {
          src: this.blobData,
          type:'video/mp4'
        }
      ]

      // var binary = '';
      // var bytes = new Uint8Array(resp);
      // var len = bytes.byteLength;
      // for (var i = 0; i < len; i++) {
      //     binary += String.fromCharCode(bytes[i]);
      // }
      // const file = new File([binary], "audio.mp3")
      // this.blobData = binary


      // var blob=new Blob([binary], {type : 'audio/ogg'});
      // var blobUrl = URL.createObjectURL(blob);
     console.log(this.blobData);
    })
  }

  getBookVideo(){
    this.bookService.getBookVideo(this.book.id).subscribe((resp:any)=>{
      if(resp.id!="00000000-0000-0000-0000-000000000000"){
        this.showPermission = true;
        this.bookVideoForm.patchValue(resp)
        this.bookVideo = resp;
        alert(resp.mediaFile)
        console.log("Kitap DATASI",this.bookVideo)
        this.videoSources =[
          {
            src: resp.mediaFile,
            type:'video/mp4'
          }
        ];
        this.vimeoSources =[
          {
            src: resp.vimeoId,
            provider: 'vimeo',
          }]
      }
      else{
        this.toastrService.error("Henüz Video Eklenmemiş")
      }
    })
  }

  createBookVideoForm() {
    this.bookVideoForm = this.fb.group({
      id: [''],
      bookId: [''],
      title:[''],
      shortDescription:[''],
      mediaType:[''],
      mediaSize:[''],
      mediaDuration:[''],
      mediaFile:[''],
      vimeoId:[this.bookVideo?.vimeoId],
      youtubeId:[''],
      isDownload:[''],
      downloadCount:[''],
      isReplay:[''],
      replayCount:[''],
      isSyncronousPlay:[''],
      syncronousPlayCount:[''],
      totalPlayCount:[''],
      totalIssueDate:[''],
      isActive:[''],
    });
  } 
  updatePermission(){
    if (this.bookVideoForm.valid) {
      const bookVideo = this.createBuildObject();
      console.log(bookVideo)
      this.bookService.updateBookVideo(bookVideo).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('PERMISSIONS_CREATED_SUCCESSFULLY'));
        this.router.navigate(['/admin/video-book/upload/'+this.book.id]);
      });
    }
  }

  createBuildObject(): Book {
    const videoId = this.bookVideoForm.get('id').value;
    const bookId = this.book.id;
    const bookVideo: any = {
      id: videoId,
      bookId:bookId,
      title: this.bookVideoForm.get('title').value,
      shortDescription: this.bookVideoForm.get('shortDescription').value,
      mediaType: this.bookVideoForm.get('mediaType').value,
      mediaSize: this.bookVideoForm.get('mediaSize').value,
      mediaDuration: this.bookVideoForm.get('mediaDuration').value,
      mediaFile: this.bookVideoForm.get('mediaFile').value,
      vimeoId: this.bookVideo?.vimeoId,
      youtubeId: this.bookVideoForm.get('youtubeId').value,
      isDownload: this.bookVideoForm.get('isDownload').value,
      downloadCount: this.bookVideoForm.get('downloadCount').value,
      isReplay: this.bookVideoForm.get('isReplay').value,
      replayCount: this.bookVideoForm.get('replayCount').value,
      isSyncronousPlay: this.bookVideoForm.get('isSyncronousPlay').value,
      syncronousPlayCount: this.bookVideoForm.get('syncronousPlayCount').value,
      totalPlayCount: this.bookVideoForm.get('totalPlayCount').value,
      totalIssueDate: this.bookVideoForm.get('totalIssueDate').value,
      isActive: this.bookVideoForm.get('isActive').value,
      
    }
    return bookVideo;
  }

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  private formatBytes(bytes, decimals?) {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
}
