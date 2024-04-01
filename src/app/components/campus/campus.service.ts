import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class CampusService  {
    constructor(
        private httpClient: HttpClient,
        private commonHttpErrorService: CommonHttpErrorService
    ){}


    getCampuses(): Observable<any | CommonError> {
        const url = `Campus/GetAllCampus`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCampus(id):Observable<any | CommonError>{
        const url = `Campus/GetCampus/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getCampusById(id):Observable<any | CommonError>{
      const url = `Campus/GetCampusById/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

    addCampus(campus): Observable<any | CommonError>{
        const url = `Campus/addCampus`;
        return this.httpClient.post<any>(url, campus)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateCampus(campus){
        const url = `Campus/UpdateCampus/${campus.code}`;
        return this.httpClient.put<any>(url, campus)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteCampus(campus: any): Observable<any | CommonError> {
        const url = `Campus/DeleteCampus/${campus}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }


      getAcademicUnits(id): Observable<any | CommonError> {
        const url = `Campus/GetAllAcademicUnit/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getAcademicUnit(id):Observable<any | CommonError>{
        const url = `Campus/GetAcademicUnit/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getAcademicUnitById(id):Observable<any | CommonError>{
      const url = `Campus/GetAcademicUnitById/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

      addAcademicUnit(academicUnit): Observable<any | CommonError>{
        const url = `Campus/addAcademicUnit`;
        return this.httpClient.post<any>(url, academicUnit)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateAcademicUnit(academicUnit){
        const url = `Campus/UpdateAcademicUnit/${academicUnit.code}`;
        return this.httpClient.put<any>(url, academicUnit)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteAcademicUnit(academicUnit: any): Observable<any | CommonError> {
        const url = `Campus/DeleteAcademicUnit/${academicUnit}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }


      getBuildings(id): Observable<any | CommonError> {
        const url = `Campus/GetAllBuilding/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getBuilding(id):Observable<any | CommonError>{
        const url = `Campus/GetBuilding/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getBuildingById(id):Observable<any | CommonError>{
      const url = `Campus/GetBuildingById/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

      addBuilding(building): Observable<any | CommonError>{
        const url = `Campus/addbuilding`;
        return this.httpClient.post<any>(url, building)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateBuilding(building){
        const url = `Campus/Updatebuilding/${building.code}`;
        return this.httpClient.put<any>(url, building)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteBuilding(building: any): Observable<any | CommonError> {
        const url = `Campus/Deletebuilding/${building}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }


      getClassrooms(id): Observable<any | CommonError> {
        const url = `Campus/GetAllClassroom/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getClassroom(id):Observable<any | CommonError>{
        const url = `Campus/GetClassroom/${id}`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

    getClassroomById(id):Observable<any | CommonError>{
      const url = `Campus/GetClassroomById/${id}`;
      return this.httpClient.get<any>(url)
        .pipe(catchError(this.commonHttpErrorService.handleError));
  }

      addClassroom(classroom): Observable<any | CommonError>{
        const url = `Campus/addClassroom`;
        return this.httpClient.post<any>(url, classroom)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      updateClassroom(classroom){
        const url = `Campus/UpdateClassroom/${classroom.code}`;
        return this.httpClient.put<any>(url, classroom)
        .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      deleteClassroom(classroom: any): Observable<any | CommonError> {
        const url = `Campus/DeleteClassroom/${classroom}`;
        return this.httpClient.delete<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
      }

      getClassroomTypes(): Observable<any | CommonError> {
        const url = `Campus/GetAllClassroomType`;
        return this.httpClient.get<any>(url)
          .pipe(catchError(this.commonHttpErrorService.handleError));
    }

}