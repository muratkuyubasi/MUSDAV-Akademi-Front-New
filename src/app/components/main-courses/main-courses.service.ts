import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MainCoursesService  {
    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getAllCategory(): Observable<any | CommonError> {
        const url = `Course/GetAllCategory`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCategory(id):Observable<any | CommonError>{
        const url = `Course/GetCategory/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    addCategory(category): Observable<any | CommonError>{
        const url = `Course/addCategory`;
        return this.httpClient.post<any>(url, category)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    updateCategory(category){
        const url = `Course/UpdateCategory/${category.code}`;
        return this.httpClient.put<any>(url, category)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    deleteCategory(category: any): Observable<any | CommonError> {
        const url = `Course/DeleteCategory/${category}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getAllCourse(): Observable<any | CommonError> {
      const url = `Course/GetAllCourse`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCategoryCourse(id): Observable<any | CommonError> {
      const url = `Course/GetAllCourseByCategory${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCourse(id):Observable<any | CommonError>{
      const url = `Course/GetCourse/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addCourse(course): Observable<any | CommonError>{
      const url = `Course/addCourse`;
      return this.httpClient.post<any>(url, course)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateCourse(course){
      const url = `Course/UpdateCourse/${course.code}`;
      return this.httpClient.put<any>(url, course)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteCourse(course: any): Observable<any | CommonError> {
      const url = `Course/DeleteCourse/${course}`;
      return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}