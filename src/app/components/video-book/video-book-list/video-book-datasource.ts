import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Book } from '@core/domain-classes/book';
import { BookResource } from '@core/domain-classes/book-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { VideoBookService } from '@core/services/video-book.service';

export class VideoBookDataSource implements DataSource<Book> {
    private bookSubject = new BehaviorSubject<Book[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;


    public get count(): number {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private bookService: VideoBookService) { }

    connect(): Observable<Book[]> {
        return this.bookSubject.asObservable();
    }

    disconnect(): void {
        this.bookSubject.complete();
        this.loadingSubject.complete();
    }

    loadBooks(bookResource: BookResource) {
        this.loadingSubject.next(true);
        this.bookService.getBooks(bookResource).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<Book[]>) => {
                const paginationParam = JSON.parse(
                    resp.headers.get('X-Pagination')
                ) as ResponseHeader;
                this.responseHeaderSubject.next(paginationParam);
                const books = [...resp.body];
                this._count = books.length;
                this.bookSubject.next(books);
            });
    }
}
