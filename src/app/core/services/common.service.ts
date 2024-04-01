import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@core/domain-classes/user';
import { catchError } from 'rxjs/operators';
import { Role } from '@core/domain-classes/role';

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  private _profileImage$: BehaviorSubject<string> = new BehaviorSubject<string>("");


  getAllUsers(): Observable<User[] | CommonError> {
    const url = `user/getAllUsers`;
    return this.httpClient.get<User[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRoles(): Observable<Role[] | CommonError> {
    const url = `role`;
    return this.httpClient.get<Role[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
