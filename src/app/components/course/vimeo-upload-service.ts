import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
//https://developer.vimeo.com/api/reference/videos
@Injectable()
export class VimeoUploadService {

  vimeoObsShare: Observable<string>;
  vimeoResult: string;

  private vimeoLink = new BehaviorSubject('');
  vimeoLinkObs = this.vimeoLink.asObservable();

  constructor(private http: HttpClient) { }

  updateVimeoLink(val) {
    this.vimeoLink.next(val);
  }

  createVimeo(options, fileSize): Observable<any> {
    // alert(fileSize)
    // CUSTOM HEADERS FOR A FIRST INIT CALL
    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + options.token });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');
    // CUSTOM INIT BODY
    const initBody = {
      'upload' : {
        'approach' : 'tus',
        'size' : fileSize,
        // 'redirect_url':'https://localhost:44431/api/VideoBook/VimeoSettings/793713034'
      },
      'name': options.videoName,
      'loop':true,
      'privacy':{
        embed:"whitelist",
        download:false,
        view:"nobody",
      },
      'embed_domains_add':"https://localhost:44472",
      'description': options.videoDescription
    };
    if (this.vimeoResult) {
      return new Observable<any>(observer => {
        observer.next(this.vimeoResult);
        observer.complete();
      });
    } else if (this.vimeoObsShare) {
      return this.vimeoObsShare;
    } else {
      return this.http.post( options.url, initBody, { headers: initHeaders});
    }
  }

  removeVimeo(options):Observable<any>{
    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + options.token });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');
    return this.http.delete(options.url)
  }

  vimeoUpload(url, file: File): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({'Tus-Resumable': '1.0.0',
      'Upload-Offset': '0',
      'Content-Type': 'application/offset+octet-stream'});
    const params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
      headers: headers
    };
    const req = new HttpRequest('PATCH', url, file, options);
    return this.http.request(req);
  }

}