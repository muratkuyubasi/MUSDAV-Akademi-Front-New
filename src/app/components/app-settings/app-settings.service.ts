import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSetting } from '@core/domain-classes/app-setting';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  updateAppSetting(appSetting: AppSetting): Observable<AppSetting | CommonError> {
    const url = `appSetting/${appSetting.id}`;
    return this.httpClient.put<AppSetting>(url, appSetting)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addAppSetting(appSetting: AppSetting): Observable<AppSetting | CommonError> {
    const url = `appSetting`;
    return this.httpClient.post<AppSetting>(url, appSetting)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getAppSetting(id: string): Observable<AppSetting | CommonError> {
    const url = `appSetting/${id}`;
    return this.httpClient.get<AppSetting>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getAppSettingByKey(key: string): Observable<AppSetting[] | CommonError> {
    const url = `appSetting/key/${key}`;
    return this.httpClient.get<AppSetting[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

}
