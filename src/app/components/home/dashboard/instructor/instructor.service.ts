import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })


export class InstructorService  {

    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getUserDashboardData():Observable<any | CommonError>{
        const url = `instructor/DashboardData`
        return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getInstructorCourses():Observable<any[] |CommonError>{
        const url = `instructor/GetCourses`
        return this.httpClient.get<any[]>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCourse(code,lang):Observable<any[] |CommonError>{
        const url = `instructor/GetInstructorCourseDetail/${code}/${lang}`
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getInstructorProfile():Observable<any |CommonError>{
        const url = `student/GetProfile`
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

    getAllCourse(): Observable<any | CommonError> {
        const url = `Course/GetAllCourse`;
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

      getOpenedCourseSection(id): Observable<any | CommonError>{
        const url = `OpenedCourse/GetOpenedCourseSection/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getOpenedCourseLessons(id): Observable<any | CommonError>{
        const url = `OpenedCourse/GetOpenedCourseLessons/${id}`;
        return this.httpClient.get<any>(url)
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

      AddLessonFile(lessonFile): Observable<any | CommonError> {
        const url = `instructor/AddLessonFile`;
        return this.httpClient.post<any>(url, lessonFile)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getAllOpenedCourseFiles(id): Observable<any | CommonError>{
        const url = `OpenedCourse/GetAllOpenedCourseFiles/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getAllOpenedCourseQuestions(id,lang): Observable<any | CommonError>{
        const url = `instructor/GetAllOpenedCourseQuestions/${id}/${lang}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateStudentLessonQuestion(question): Observable<any | CommonError>{
        const url = `student/UpdateStudentLessonQuestion`;
        return this.httpClient.put<any>(url, question)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }
      getAllOpenedCourseStudents(id): Observable<any | CommonError>{
        const url = `OpenedCourse/GetAllOpenedCourseStudents/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getCourseDays(): Observable<any | CommonError>{
        const url = `OpenedCourse/GetAllCourseDays`;
          return this.httpClient.get<any>(url)
            .pipe(catchError(this.commonHttpErrorService.handleError));
      }
      

      

}