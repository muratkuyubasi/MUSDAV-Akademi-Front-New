import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../campus.service';
import { BaseComponent } from 'src/app/base.component';
import { filter, map, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject } from 'rxjs';
import { TranslationService } from '@core/services/translation.service';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-academicunit-list',
    templateUrl: 'academicunit-list.component.html'
})

export class AcademicUnitListComponent extends BaseComponent implements OnInit {
    selectedLang:string;
    displayedColumns: string[] = ['name','buildings', 'action'];
    campus:any;
    dataSource = new MatTableDataSource();
    constructor(
        private campusService:CampusService,
        private translationService: TranslationService,
        private activeRoute:ActivatedRoute,
        private router:Router,
        private commonDialogService:CommonDialogService,
        private toastrService:ToastrService
    ) {
        super()
     }

    ngOnInit() { 
      this.sub$.sink = this.activeRoute.data.subscribe(
        (data: { campus: any }) => {
          if (data.campus) {
            this.campus = data.campus;
            
            this.getAcademicUnits()
          } 
      });
    }

    getAcademicUnits(){
        this.campusService.getAcademicUnits(this.campus.code).subscribe((resp:any)=>{

            this.dataSource = new MatTableDataSource(resp.data)

        })
    }

    deletePage(campus: any): void {
        let name = campus.academicUnitRecords.filter(item=>item.languageCode == this.defaultLang$)[0].name
        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${name}`)
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.sub$.sink = this.campusService.deleteAcademicUnit(campus.code)
              .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                this.getAcademicUnits()
              });
          }
        });
      }
    
      managePage(campus?: any): void {
        this.router.navigate(['/admin/campuses/manage-academicunit', this.campus.code,campus.code])
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}