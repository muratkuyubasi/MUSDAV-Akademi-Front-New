import { Component, OnInit, Input, Inject,ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '@core/domain-classes/book';
import { TranslationService } from '@core/services/translation.service';
import { VideoBookService } from '@core/services/video-book.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-manage-permission',
    templateUrl: 'manage-permission.component.html'
})

export class ManagePermissionComponent extends BaseComponent implements OnInit {
    @Input() book:Book
    @Input() bookVideo:any;

    bookVideoForm: UntypedFormGroup;
    isEditMode = false
    showPermission:boolean;
    totalIssue:number=0;
    constructor(
       private activeRoute:ActivatedRoute,
        private fb: UntypedFormBuilder,
        private bookService:VideoBookService,
        private toastrService: ToastrService,
        private translationService:TranslationService
    ) {
        super()
        this.createBookVideoForm()
     }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { book: Book }) => {
              if (data.book) {
                this.isEditMode = true;
                this.book = data.book;
                // this.getBookVideo();
                // this.getVideoFile()
              } 
            });
          
              
        this.bookVideo = this.book?.bookVideos[0];
        this.bookVideoForm.patchValue(this.bookVideo)
        this.getIssueCounts();
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
          isDownload:[false],
          downloadCount:[0],
          isReplay:[false],
          replayCount:[0],
          isSyncronousPlay:[false],
          syncronousPlayCount:[0],
          totalPlayCount:[0],
          totalIssueDate:[0],
          isActive:[false],
        });
    } 

    updatePermission(){
        if (this.bookVideoForm.valid) {
          const bookVideo = this.createBuildObject();
          this.bookService.updateBookVideo(bookVideo).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('PERMISSIONS_CREATED_SUCCESSFULLY'));
          });
        }
    }
    
    createBuildObject(): Book {
        const videoId = this.bookVideo.id;
        const bookId = this.book.id;

        const bookVideo: any = {
          id: videoId,
          bookId:bookId,
          title: this.bookVideo?.title,
          shortDescription: this.bookVideo?.shortDescription,
          mediaType: this.bookVideo?.mediaType,
          mediaSize: this.bookVideo?.mediaSize,
          mediaDuration: this.bookVideo?.mediaDuration,
          mediaFile: this.bookVideo?.mediaFile,
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

    getBookVideo(){
        this.bookService.getBookVideo(this.book.id).subscribe((resp:any)=>{
          if(resp.id!="00000000-0000-0000-0000-000000000000"){
            this.showPermission = true;
            this.bookVideoForm.patchValue(resp)
            this.bookVideo = resp;
          }
          else{
            this.toastrService.error("Henüz Video Eklenmemiş")
          }
        })
    }

    getIssueCounts(){
      this.bookService.getIssueCount(this.bookVideo?.id).subscribe((resp:any)=>{
        this.totalIssue = resp
      })
    }
}