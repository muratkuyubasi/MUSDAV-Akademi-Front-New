import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OpenedCoursesService  {
    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getAllOpenedCourseType(): Observable<any | CommonError> {
        const url = `OpenedCourse/GetAllOpenedCourseTypes`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getAllOpenedCourse(): Observable<any | CommonError> {
      const url = `OpenedCourse/GetAllOpenedCourse`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getTypeCourse(id): Observable<any | CommonError> {
      const url = `OpenedCourse/GetAllCourseByType${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getOpenedCourse(id):Observable<any | CommonError>{
      const url = `OpenedCourse/GetOpenedCourse/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addOpenedCourse(course): Observable<any | CommonError>{
      const url = `OpenedCourse/addOpenedCourse`;
      return this.httpClient.post<any>(url, course)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateOpenedCourse(course): Observable<any | CommonError>{
      const url = `OpenedCourse/UpdateOpenedCourse`;
      return this.httpClient.put<any>(url, course)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteOpenedCourse(course: any): Observable<any | CommonError> {
      const url = `OpenedCourse/DeleteOpenedCourse/${course}`;
      return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  

  addOpenedCourseLesson(course): Observable<any | CommonError>{
    const url = `OpenedCourse/AddOpenedCourseLesson`;
    return this.httpClient.post<any>(url, course)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateOpenedCourseLesson(course){
    const url = `OpenedCourse/UpdateOpenedCourseLesson`;
    return this.httpClient.put<any>(url, course)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteOpenedCourseLesson(course: any): Observable<any | CommonError> {
      const url = `OpenedCourse/DeleteOpenedCourseLesson/${course}`;
      return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCourseDays(): Observable<any | CommonError>{
    const url = `OpenedCourse/GetAllCourseDays`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCampusClassroom(): Observable<any | CommonError>{
    const url = `Campus/Search`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCourseStudents(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetAllOpenedCourseStudents/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addOpenedCourseStudent(student): Observable<any | CommonError>{
    const url = `OpenedCourse/AddOpenedCourseStudent`;
    return this.httpClient.post<any>(url, student)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  checkUser(id,email): Observable<any | CommonError> {
    const url = `OpenedCourse/CheckUser/${id}/${email}`;
    return this.httpClient.post<any>(url,email)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOpenedCourseLesson(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseLesson/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  getOpenedCourseLessons(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseLessons/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  AddLessonFile(lessonFile): Observable<any | CommonError> {
    const url = `OpenedCourse/AddLessonFile`;
    return this.httpClient.post<any>(url, lessonFile)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOpenedCourseSection(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseSection/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  getOpenedCourseSections(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseSections/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addOpenedCourseSection(section): Observable<any | CommonError> {
    const url = `OpenedCourse/AddOpenedCourseSection`;
    return this.httpClient.post<any>(url, section)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateOpenedCourseSection(section): Observable<any | CommonError>{
    const url = `OpenedCourse/UpdateCourseSection`;
    return this.httpClient.put<any>(url, section)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  
  deleteOpenedCourseSection(section: any): Observable<any | CommonError> {
    const url = `OpenedCourse/DeleteOpenedCourseSection/${section}`;
    return this.httpClient.delete<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


  getOpenedCourseBranch(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseBranche/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  getOpenedCourseBranches(id): Observable<any | CommonError>{
    const url = `OpenedCourse/GetOpenedCourseBranches/${id}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addOpenedCourseBranch(branch): Observable<any | CommonError> {
    console.log(branch)
    const url = `OpenedCourse/AddOpenedCourseBranche`;
    return this.httpClient.post<any>(url, branch)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateOpenedCourseBranch(branch): Observable<any | CommonError>{
    const url = `OpenedCourse/UpdateCourseBranche`;
    return this.httpClient.put<any>(url, branch)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  
  deleteOpenedCourseBranch(branch: any): Observable<any | CommonError> {
    const url = `OpenedCourse/DeleteOpenedCourseBranche/${branch}`;
    return this.httpClient.delete<any>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }





}