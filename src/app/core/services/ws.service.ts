import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@core/domain-classes/user';
import { catchError } from 'rxjs/operators';
import { Role } from '@core/domain-classes/role';

@Injectable({ providedIn: 'root' })
export class WSService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  private _profileImage$: BehaviorSubject<string> = new BehaviorSubject<string>("");


  checkCountryCities(countryRecordId:any): Observable<any | CommonError>{
    const url = `ws/GetCountryCities/${countryRecordId}`;
 
    return this.httpClient.get<any>(url,{
        observe: 'response'
    })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  checkCityStates(cityRecordId:any): Observable<any | CommonError>{
    const url = `ws/GetCityStates/${cityRecordId}`;
    return this.httpClient.get<any>(url,{
        observe: 'response'
    })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  saveWsCities(wsData: any): Observable<void | CommonError> {
    const url = 'country/addCity';
    return this.httpClient.post<void>(url, wsData)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  saveWsStates(wsData: any): Observable<void | CommonError> {
    const url = 'country/addstate';
    return this.httpClient.post<void>(url, wsData)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
