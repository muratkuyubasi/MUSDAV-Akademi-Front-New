import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { OfferResource } from '@core/domain-classes/offer-resources';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';

@Injectable({ providedIn: 'root' })

export class OfferService  {
    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getCourses(resource: HomePageCourseResource): Observable<HttpResponse<any[]> | CommonError> {
        const url = `HomePage/GetOpenedCourses`;
        const customParams = new HttpParams()
          .set('Fields', resource.fields)
          .set('OrderBy', resource.orderBy)
          .set('PageSize', resource.pageSize.toString())
          .set('Skip', resource.skip.toString())
          .set('SearchQuery', resource.searchQuery)
          .set('title', resource.title.toString())
          .set('categorySlug', resource.categorySlug.toString())
          .set('courseSlug', resource.courseSlug.toString())
          .set('categoryName', resource.categoryName.toString())
          .set('title', resource.title.toString())
          .set('isPopular', resource.isPopuler.toString())
          .set('isRecommend', resource.isRecommend.toString())
          .set('isPublish', resource.isPublish.toString())
          .set('isConfirmed', resource.isConfirmed.toString())
    
        return this.httpClient.get<any[]>(url, {
          params: customParams,
          observe: 'response'
        }).pipe(catchError(this.commonHttpErrorService.handleError));

    }

    getOffers(resource: OfferResource): Observable<HttpResponse<any[]> | CommonError> {
        const url = `offer/GetOffers`;
        const customParams = new HttpParams()
          .set('Fields', resource.fields)
          .set('OrderBy', resource.orderBy)
          .set('PageSize', resource.pageSize.toString())
          .set('Skip', resource.skip.toString())
          .set('SearchQuery', resource.searchQuery)
          .set('Status',resource.offerStatus)
          .set('isActive', resource.isActive? '1':'0')
          .set('title', resource.title.toString())
          .set('keyword', resource.keyword.toString())
          .set('courseTypeId', resource.userId.toString())
          .set('userId', resource.userId.toString())    
        return this.httpClient.get<any[]>(url, {
          params: customParams,
          observe: 'response'
        }).pipe(catchError(this.commonHttpErrorService.handleError));

    }

    getOffer(code):Observable<any | CommonError>{
        const url = `offer/GetOffer/${code}`;
        return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addOffer(offer):Observable<any | CommonError>{
        const url = `offer/AddOffer`;
        return this.httpClient.post<any>(url, offer)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateOffer(data):Observable<any | CommonError>{
        const url = `offer/UpdateOffer`;
        return this.httpClient.put<any>(url, data)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    deleteOffer(id):Observable<any |CommonError>{
        const url = `offer/DeleteOffer/${id}`
        return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addOfferUser(offer):Observable<any | CommonError>{
        const url = `offer/AddOfferUser`;
        return this.httpClient.post<any>(url, offer)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateOfferUser(data):Observable<any | CommonError>{
        const url = `offer/UpdateOfferUser`;
        return this.httpClient.put<any>(url, data)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    deleteOfferUser(id):Observable<any |CommonError>{
        const url = `offer/DeleteOfferUser/${id}`
        return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }


}