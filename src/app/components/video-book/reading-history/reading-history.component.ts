import { Component, Input, OnInit } from '@angular/core';
import { VideoBookService } from '@core/services/video-book.service';
import { delay } from 'rxjs';

@Component({
    selector: 'app-reading-history',
    templateUrl: 'reading-history.component.html'
})

export class ReadingHistoryComponent implements OnInit {

    history:any;
    @Input() book:any;

    bookVideo:any
    constructor(
        private bookService:VideoBookService
    ) { }

    ngOnInit() {
        this.bookVideo = this.book?.bookVideos[0];
        console.log("AA",this.bookVideo)
        this.getReadingHistory()
     }

     getReadingHistory(){
        console.log("AAAAAAAA",this.bookVideo)
        this.bookService.getReadingHistory(this.bookVideo?.id).subscribe((resp:any)=>{
          this.history = resp;
            console.log(this.history);
        })
     }

     checkIn(issue){
        
        console.log("Click",issue)
        const item ={
            id:issue.issueId,
            userId:issue.userId,
            bookVideoId:issue.bookVideoId
        }

        console.log("GidecekDATA",item)
        this.bookService.itemCheckIn(item).subscribe(resp=>{
            this.getReadingHistory()
        })
     }
}