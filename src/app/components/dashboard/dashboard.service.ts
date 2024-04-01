import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { catchError } from 'rxjs/operators';
import { User } from '@core/domain-classes/user';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

    getTotalBookCount(): Observable<number | CommonError> {
      const url = `dashboard/GetTotalBookCount`;
      return this.httpClient.get<number>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getTotalIssueCount(): Observable<number | CommonError> {
      const url = `dashboard/GetTotalIssueCount`;
      return this.httpClient.get<number>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getTotalOldIssueCount(): Observable<number | CommonError> {
      const url = `dashboard/GetTotalOldIssueCount`;
      return this.httpClient.get<number>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
    }

  getActiveUserCount(): Observable<number | CommonError> {
    const url = `dashboard/GetActiveUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getInactiveUserCount(): Observable<number | CommonError> {
    const url = `dashboard/GetInactiveUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getTotalUserCount(): Observable<number | CommonError> {
    const url = `dashboard/GetTotalUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOnlineUser(): Observable<User[] | CommonError> {
    const url = `dashboard/getOnlineUsers`;
    return this.httpClient.get<User[]>(url).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCurrentIssues(): Observable<any[] | CommonError> {
    const url = `dashboard/getCurrentIssues`;
    return this.httpClient.get<any[]>(url).pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
