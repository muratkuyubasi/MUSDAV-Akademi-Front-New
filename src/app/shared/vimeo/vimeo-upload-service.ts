import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import { environment } from '@environments/environment';
//https://developer.vimeo.com/api/reference/videos
@Injectable()
export class VimeoUploadService {

  vimeoToken = environment.vimeoApiKey;

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
        view:"disable",
      },
      'embed_domains_add':"https://uzaktanegitimakademisi.com",
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

  removeVimeo(options,vimeoId):Observable<any>{
    vimeoId="833092682"
    const vimeoUrl = "nm/https://api.vimeo.com/me/videos/"+vimeoId
    // let url = options.url.slice(8)
    // alert(url)
    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + options.token });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');
    return this.http.delete(vimeoUrl)
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

  getVideoDetail(vimeoId): Observable<any>{

    console.log("VİDEO IDS",vimeoId)
    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + this.vimeoToken });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');

    const vimeoUrl = "nm/https://api.vimeo.com/me/videos/"+vimeoId
    return this.http.get(vimeoUrl,{headers:initHeaders})
  }


  createVideoThumbnail(){
     const options = {
      token:this.vimeoToken,
      url : 'nm/https://api.vimeo.com/videos/831797322/pictures'
    };

    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + options.token });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');

    const initBody = {
      'active' : true,
      'time':500,
      'default_picture':true
    };

    return this.http.post(options.url, initBody,{headers:initHeaders})
  }


  getVimeoVideoThumbnail(){
    const options = {
      token:environment.vimeoApiKey,
      url : 'nm/https://api.vimeo.com/videos/831797322/pictures/1677481614'
    };

    const initHeaders = new HttpHeaders({'Authorization': 'bearer ' + options.token });
    initHeaders.append('Content-Type', 'application/json');
    initHeaders.append('Accept', 'application/vnd.vimeo.*+json;version=3.4');

    return this.http.get(options.url,{headers:initHeaders})
  }
}