import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Book } from '@core/domain-classes/book';
import { VideoBookService } from '@core/services/video-book.service';
import { Observable } from 'rxjs';

@Injectable()
export class VideoBookDetailResolverService implements Resolve<Book> {
    constructor(private bookService: VideoBookService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Book> {
        const id = route.paramMap.get('id');
        return this.bookService.getBook(id) as Observable<Book>;
    }
}
