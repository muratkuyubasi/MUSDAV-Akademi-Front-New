import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Book } from '@core/domain-classes/book';
import { BookResource } from '@core/domain-classes/book-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { VideoBookDataSource } from './video-book-datasource';
import { VideoBookService } from '@core/services/video-book.service';

@Component({
  selector: 'app-video-book-list',
  templateUrl: './video-book-list.component.html',
  styleUrls: ['./video-book-list.component.scss']
})
export class VideoBookListComponent extends BaseComponent implements OnInit, AfterViewInit {

  dataSource: VideoBookDataSource;
  books: Book[] = [];
  displayedColumns: string[] = ['action', 'isbn', 'name', 'author',  'publisherName', 'isActive'];
  footerToDisplayed: string[] = ["footer"];
  isLoadingResults = true;
  bookResource: BookResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  nameFilterCtl: UntypedFormControl = new UntypedFormControl('');
  publisherNameFilterCtl: UntypedFormControl = new UntypedFormControl('');
  authorFilterCtl: UntypedFormControl = new UntypedFormControl('');
  isbnSearchFilterCtl: UntypedFormControl = new UntypedFormControl('');
  isActiveSearchFilterCtl: UntypedFormControl = new UntypedFormControl(true);


  constructor(
    private bookService: VideoBookService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    private translationService: TranslationService) {
    super();
    this.bookResource = new BookResource();
    this.bookResource.pageSize = 20;
    this.bookResource.isVideoBook = false;
    this.bookResource.orderBy = 'createdDate desc'
  }

  ngOnInit(): void {
    this.dataSource = new VideoBookDataSource(this.bookService);
    this.dataSource.loadBooks(this.bookResource);
    this.getResourceParameter();
    this.filterLogic();
  }

  filterLogic() {
    this.sub$.sink = this.nameFilterCtl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(c => {
      this.bookResource.name = c;
      this.bookResource.skip = 0;
      this.dataSource.loadBooks(this.bookResource);
    });

    this.sub$.sink = this.authorFilterCtl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(c => {
      this.bookResource.author = c;
      this.bookResource.skip = 0;
      this.dataSource.loadBooks(this.bookResource);
    });

    this.sub$.sink = this.publisherNameFilterCtl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(c => {
      this.bookResource.publisherName = c;
      this.bookResource.skip = 0;
      this.dataSource.loadBooks(this.bookResource);
      // if (c) {
      //   const name = c.trim().split(' ');
      //   this.bookResource.name = name[0];
      //   if (name.length > 1)
      //     this.userResource.last_name = name[1];
      //   this.userResource.skip = 0;
      // } else {
      //   this.userResource.first_name = '';
      //   this.userResource.last_name = '';
      //   this.userResource.skip = 0;
      // }
      this.dataSource.loadBooks(this.bookResource);
    });

    this.sub$.sink = this.isbnSearchFilterCtl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(c => {
      this.bookResource.isbn = c;
      this.bookResource.skip = 0;
      this.dataSource.loadBooks(this.bookResource);
    });

    this.sub$.sink = this.isActiveSearchFilterCtl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(c => {
      this.bookResource.is_active = c;
      this.bookResource.skip = 0;
      this.dataSource.loadBooks(this.bookResource);
    })

  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.bookResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.bookResource.pageSize = this.paginator.pageSize;
          this.bookResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadBooks(this.bookResource);
        })
      )
      .subscribe();

  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.bookResource.pageSize = c.pageSize;
          this.bookResource.skip = c.skip;
          this.bookResource.totalCount = c.totalCount;
        }
      });
  }

  
  uploadVideo(bookId: string) {
    this.router.navigate(['/admin/video-book/upload', bookId])
  }
  editBook(bookId: string) {
    this.router.navigate(['/admin/video-book/manage', bookId])
  }
  deleteBook(book){
    
  }

}
