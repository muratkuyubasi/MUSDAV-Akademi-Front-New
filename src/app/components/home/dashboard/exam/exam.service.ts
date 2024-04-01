import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { OfferResource } from '@core/domain-classes/offer-resources';
import { ExamQuestionResource, ExamResource } from '@core/domain-classes/exam-resources';
@Injectable({ providedIn: 'root' })

export class ExamService  {

    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}

    getUserExams(resource: ExamResource): Observable<HttpResponse<any[]> | CommonError> {
        const url = `exam/GetExams`;
        const customParams = new HttpParams()
          .set('Fields', resource.fields)
          .set('OrderBy', resource.orderBy)
          .set('PageSize', resource.pageSize.toString())
          .set('Skip', resource.skip.toString())
          .set('SearchQuery', resource.searchQuery.toString())
          .set('IsActive',resource.isActive.toString())
          .set('LanguageCode',resource.languageCode.toString())
          .set('title', resource.title.toString())
          .set('userId', resource.userId.toString())    
        return this.httpClient.get<any[]>(url, {
          params: customParams,
          observe: 'response'
        }).pipe(catchError(this.commonHttpErrorService.handleError));

    }

    getExam(code,lang):Observable<any[] |CommonError>{
        const url = `exam/GetExam/${code}`
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

  addExam(exam): Observable<any | CommonError>{
      const url = `exam/addExam`;
      return this.httpClient.post<any>(url, exam)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateExam(exam): Observable<any | CommonError>{
      const url = `exam/UpdateExam`;
      return this.httpClient.put<any>(url, exam)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteExam(exam: any): Observable<any | CommonError> {
      const url = `exam/DeleteExam/${exam}`;
      return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addQuestion(question): Observable<any | CommonError>{
    const url = `exam/AddExamQuestion`;
    return this.httpClient.post<any>(url, question)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateQuestion(question): Observable<any | CommonError>{
      const url = `exam/UpdateExamQuestion`;
      return this.httpClient.put<any>(url, question)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteQuestion(question: any): Observable<any | CommonError> {
      const url = `exam/DeleteExamQuestion/${question}`;
      return this.httpClient.delete<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getExamQuestions(resource: ExamQuestionResource): Observable<HttpResponse<any[]> | CommonError> {
    const url = `exam/GetExamQuestions`;
    const customParams = new HttpParams()
      .set('Fields', resource.fields)
      .set('OrderBy', resource.orderBy)
      .set('PageSize', resource.pageSize.toString())
      .set('Skip', resource.skip.toString())
      .set('SearchQuery', resource.searchQuery.toString())
      .set('LanguageCode',resource.languageCode.toString())
      .set('questionText', resource.questionText.toString())
      .set('questionCode', resource.questionCode.toString())
      .set('examId', resource.examId)
      .set('userId', resource.userId.toString())    
    return this.httpClient.get<any[]>(url, {
      params: customParams,
      observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));

  }


  getUserCourses():Observable<any[] |CommonError>{
      const url = `instructor/GetCourses`
      return this.httpClient.get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}