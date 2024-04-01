import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { User } from '@core/domain-classes/user';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { UserClaim } from '@core/domain-classes/user-claim';
import { UserResource } from '@core/domain-classes/user-resource';
import { BookResource } from '@core/domain-classes/book-resource';
import { Book } from '@core/domain-classes/book';

@Injectable({ providedIn: 'root' })
export class VideoBookService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  updateBook(book: Book): Observable<Book | CommonError> {
    console.log("GELEN",book)
    const url = `videobook/UpdateBook/${book.id}`;
    return this.httpClient.put<Book>(url, book)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addBook(book: Book): Observable<Book | CommonError> {
    const url = `videobook/addbook`;
    return this.httpClient.post<Book>(url, book)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteBook(id: string): Observable<void | CommonError> {
    const url = `videobook/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getBook(id: string): Observable<Book | CommonError> {
    const url = `videobook/GetBook/${id}`;
    return this.httpClient.get<Book>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  getBookFromIsbn(isbn: string): Observable<any | CommonError> {
    const url = `videobook/GetBookFromIsbn/${isbn}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateBookVideo(bookVideo: any): Observable<any | CommonError> {

    console.log(bookVideo)

    const url = `videobook/UpdateBookVideo`;
    return this.httpClient.put<any>(url, bookVideo)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getBookVideo(id:string): Observable<any | CommonError> {
    const url = `videobook/GetBookVideo/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addVideoBook(bookVideo:any):Observable<any | CommonError>{
    const url = `videobook/AddBookVideo`;
    return this.httpClient.post<any>(url, bookVideo)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }


  getBooks(resource: BookResource): Observable<HttpResponse<Book[]> | CommonError> {
    const url = `videobook/GetBooks`;
    const customParams = new HttpParams()
      .set('Fields', resource.fields)
      .set('OrderBy', resource.orderBy)
      .set('PageSize', resource.pageSize.toString())
      .set('Skip', resource.skip.toString())
      .set('SearchQuery', resource.searchQuery)
      .set('Name', resource.name.toString())
      .set('Isbn', resource.isbn.toString())
      .set('Author', resource.author.toString())
      .set('PublisherName', resource.publisherName.toString())
      .set('Topic', resource.topic.toString())
      .set('IsVideoBook', resource.isVideoBook? 'true':'false')
      .set('IsAudioBook', resource.isAudioBook? 'true':'false')
      .set('IsEpub', resource.isEpub? 'true':'false')
      .set('IsActive', resource.is_active? 'true':'false')
    return this.httpClient.get<Book[]>(url, {
      params: customParams,
      observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getVideoFile(fileName):Observable<any | CommonError>{
    const url = `videobook/streamvideos/${fileName}`;
    return this.httpClient.get(url,
      {
      responseType:'arraybuffer'
    })
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addMedia(media:FormData): Observable<any | CommonError> {
    console.log(media)
    const url = `videobook/AddMedia`;
    return this.httpClient.post<any>(url, media)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getReadingHistory(id): Observable<any | CommonError> {
    const url = `issue/GetReadingHistory/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  itemCheckIn(data): Observable<any | CommonError> {
    console.log("DATA",data)
    const url = `issue/itemcheckin`;
 
    return this.httpClient.post<any>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getIssueCount(id): Observable<any | CommonError> {
    const url = `issue/GetBookIssueCount/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

}
