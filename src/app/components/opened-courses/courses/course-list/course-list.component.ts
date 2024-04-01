import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { filter, map, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject } from 'rxjs';
import { TranslationService } from '@core/services/translation.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { OpenedCoursesService } from '../../opened-courses.service';

@Component({
    selector: 'app-course-list',
    templateUrl: 'course-list.component.html'
})

export class OpenedCourseListComponent extends BaseComponent implements OnInit {
    selectedLang:string;
    displayedColumns: string[] = ['suggest','name','type','status', 'action'];

    dataSource = new MatTableDataSource();
    constructor(
        private coursesService:OpenedCoursesService,
        private translationService: TranslationService,
        private router:Router,
        private commonDialogService:CommonDialogService,
        private toastrService:ToastrService
    ) {
        super()
     }

    ngOnInit() { 
        this.getAllOpenedCourses()   
    }

    getAllOpenedCourses(){
        this.coursesService.getAllOpenedCourse().subscribe((resp:any)=>{
          console.log(resp.data)
            this.dataSource = new MatTableDataSource(resp.data)
        })
    }

    deletePage(course: any): void {
        let name = course.openedCourseRecords.filter(item=>item.languageCode == this.defaultLang$)[0].title

        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${name}`)
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.sub$.sink = this.coursesService.deleteOpenedCourse(course.code)
              .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                this.getAllOpenedCourses()
              });
          }
        });
      }
    
      managePage(course?: any): void {
        this.router.navigate(['/admin/opened-courses/manage-opened-course', course.code])
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}