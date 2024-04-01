import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource'
@Injectable({ providedIn: 'root' })

export class CourseService  {
    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getCategories(): Observable<any | CommonError> {
      const url = `Course/GetAllCategory`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCourses(resource: HomePageCourseResource ): Observable<HttpResponse<any[]> | CommonError> {
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

    getCourse(id,lang): Observable<HttpResponse<any> | CommonError>{
      const url = `HomePage/GetOpenedCourse/${id}/${lang}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addStudentToCourse(student):Observable<any | CommonError>{
      const url = `OpenedCourse/AddOpenedCourseStudent`;
    return this.httpClient.post<any>(url, student)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    checkUserCourse(userId, courseId):Observable<any | CommonError>{
      const url = `HomePage/CheckUserCourse/${userId}/${courseId}`;
      return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getStudentCourse(id,lang): Observable<HttpResponse<any> | CommonError>{
      const url = `student/GetStudentCourseDetail/${id}/${lang}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addStudentAttendance(data):Observable<any | CommonError>{
      const url = `student/AddStudentLessonAttendance`;
      return this.httpClient.post<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateStudentAttendance(data):Observable<any | CommonError>{
      const url = `student/UpdateStudentLessonAttendance`;
      return this.httpClient.put<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addStudentQuestion(data):Observable<any | CommonError>{
      const url = `student/AddStudentLessonQuestion`;
      return this.httpClient.post<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateStudentQuestion(data):Observable<any | CommonError>{
      const url = `student/UpdateStudentLessonQuestion`;
      return this.httpClient.put<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addStudentNote(data):Observable<any | CommonError>{
      const url = `student/AddStudentLessonNote`;
      return this.httpClient.post<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateStudentNote(data):Observable<any | CommonError>{
      const url = `student/UpdateStudentLessonNote`;
      return this.httpClient.put<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addStudentComment(data):Observable<any | CommonError>{
      const url = `student/AddStudentLessonComment`;
      return this.httpClient.post<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateStudentComment(data):Observable<any | CommonError>{
      const url = `student/UpdateStudentLessonComment`;
      return this.httpClient.put<any>(url, data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getLastCourse(): Observable<HttpResponse<any> | CommonError>{
      const url = `student/GetLastCourse`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }
}