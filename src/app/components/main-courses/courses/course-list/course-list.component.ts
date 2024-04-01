import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { filter, map, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject } from 'rxjs';
import { TranslationService } from '@core/services/translation.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MainCoursesService } from '../../main-courses.service';

@Component({
    selector: 'app-course-list',
    templateUrl: 'course-list.component.html'
})

export class CourseListComponent extends BaseComponent implements OnInit {
    selectedLang:string;
    displayedColumns: string[] = ['name','status', 'action'];

    dataSource = new MatTableDataSource();
    constructor(
        private coursesService:MainCoursesService,
        private translationService: TranslationService,
        private router:Router,
        private commonDialogService:CommonDialogService,
        private toastrService:ToastrService
    ) {
        super()
     }

    ngOnInit() { 
        this.getAllCourses()   
    }

    getAllCourses(){
        this.coursesService.getAllCourse().subscribe((resp:any)=>{
            this.dataSource = new MatTableDataSource(resp.data)
        })
    }

    deletePage(course: any): void {
        let name = course.courseRecords.filter(item=>item.languageCode == this.defaultLang$)[0].name
        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${name}`)
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.sub$.sink = this.coursesService.deleteCourse(course.code)
              .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                this.getAllCourses()
              });
          }
        });
      }
    
      managePage(course?: any): void {
        this.router.navigate(['/admin/courses/manage-course', course.code])
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}