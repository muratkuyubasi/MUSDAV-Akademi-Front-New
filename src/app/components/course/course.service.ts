import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { User } from '@core/domain-classes/user';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { UserClaim } from '@core/domain-classes/user-claim';
import { UserResource } from '@core/domain-classes/user-resource';
import { Course } from './course.model';
import { CourseResource } from './course-resource';
import { UserRoles } from '@core/domain-classes/user-roles';

@Injectable({ providedIn: 'root' })
export class CourseService {

    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getCourses(resource: CourseResource): Observable<HttpResponse<Course[]> | CommonError> {
        const url = `course/GetAllCourse`;
        const customParams = new HttpParams()
          .set('Fields', resource.fields)
          .set('OrderBy', resource.orderBy)
          .set('PageSize', resource.pageSize.toString())
          .set('Skip', resource.skip.toString())
          .set('SearchQuery', resource.searchQuery)
          .set('Title', resource.title)
          .set('CategoryName', resource.categoryName)
          .set('Teacher', resource.teacher)
          .set('Code', resource.code.toString())
          .set('IsFree', resource.isFree? 'true':'false')
          .set('AllCourse', resource.allCourse? 'true':'false')
          .set('IsRecommended', resource.isRecommended? 'true':'false')
          .set('IsPopular', resource.isPopular? 'true':'false')
          .set('IsActive', resource.isActive? '1':'0')
        return this.httpClient.get<Course[]>(url, {
          params: customParams,
          observe: 'response'
        }).pipe(catchError(this.commonHttpErrorService.handleError));
      }

    getCourse(id: string): Observable<Course | CommonError> {
        const url = `course/${id}`;
        return this.httpClient.get<Course>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateBook(course: Course): Observable<Course | CommonError> {
        const url = `videobook/UpdateBook/${course.id}`;
        return this.httpClient.put<Course>(url, course)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }
    
      addBook(course: Course): Observable<Course | CommonError> {
        const url = `videobook/addbook`;
        return this.httpClient.post<Course>(url, course)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }
    
      deleteBook(id: string): Observable<void | CommonError> {
        const url = `videobook/${id}`;
        return this.httpClient.delete<void>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getCategories(): Observable<any | CommonError> {
        const url = `coursecategory`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getTeachers(id: string): Observable<UserRoles[] | CommonError> {
        const url = `roleusers/${id}`;
        return this.httpClient.get<UserRoles[]>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getSection(id): Observable<any | CommonError> {
        const url = `course/getsection/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      addSection(section): Observable<any | CommonError>{
        const url = `course/addsection`;
        return this.httpClient.post<any>(url, section)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateSection(section){
        const url = `course/UpdateSection`;
        return this.httpClient.put<any>(url, section)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteSection(section: any): Observable<any | CommonError> {
        const url = `course/deletesection/${section.code}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      addCourse(course): Observable<any | CommonError>{
        const url = `course/addcourse`;
        return this.httpClient.post<any>(url, course)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateCourse(course){
        const url = `course/UpdateCourse`;
        return this.httpClient.put<any>(url, course)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteCourse(course: any): Observable<any | CommonError> {
        const url = `course/deletecourse/${course.code}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }


      addLesson(lesson): Observable<any | CommonError>{
        const url = `course/addlesson`;
        return this.httpClient.post<any>(url, lesson)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateLesson(lesson){
        const url = `course/UpdateLesson`;
        return this.httpClient.put<any>(url, lesson)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteLesson(lesson: any): Observable<any | CommonError> {
        const url = `course/deletelesson/${lesson.code}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      addFile(formData): Observable<any | CommonError>{
        return ;
        
      }

     
    



}