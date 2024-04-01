import { AfterViewInit, Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CourseDataSource } from './course-datasource';
import { Course } from '../course.model';
import { CourseResource } from '../course-resource';
import { CourseService } from '../course.service';
import { BaseComponent } from 'src/app/base.component';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-course-list',
    templateUrl: 'course-list.component.html'
})

export class CourseListComponent extends BaseComponent implements OnInit, AfterViewInit {
    
    dataSource: CourseDataSource;
    courses: Course[] = [];
    displayedColumns: string[] = ['action', 'title', 'categoryName', 'teacher',  'isActive'];
    footerToDisplayed: string[] = ["footer"];
    isLoadingResults = true;
    courseResource: CourseResource;
    loading$: Observable<boolean>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input') input: ElementRef;

  titleFilterCtl: UntypedFormControl = new UntypedFormControl('');
  categoryNameFilterCtl: UntypedFormControl = new UntypedFormControl('');
  teacherFilterCtl: UntypedFormControl = new UntypedFormControl('');
  isActiveSearchFilterCtl: UntypedFormControl = new UntypedFormControl(true);



    constructor(
        private courseService: CourseService,
        private router:Router,
        private translationService:TranslationService,
        private commonDialogService:CommonDialogService,
        private toastrService:ToastrService
     ) {
        super()
        this.courseResource = new CourseResource();
        this.courseResource.pageSize = 20;
        // this.courseResource.orderBy = 'createdDate desc'
      }

    ngOnInit() {
        this.dataSource = new CourseDataSource(this.courseService);
         this.dataSource.loadBooks(this.courseResource);
        this.getResourceParameter();
        this.filterLogic()
     }
     filterLogic() {
        this.sub$.sink = this.titleFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.courseResource.title = c;
          this.courseResource.skip = 0;
          this.dataSource.loadBooks(this.courseResource);
        });
    
        this.sub$.sink = this.teacherFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.courseResource.teacher = c;
          this.courseResource.skip = 0;
          this.dataSource.loadBooks(this.courseResource);
        });
    
        this.sub$.sink = this.categoryNameFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.courseResource.categoryName = c;
          this.courseResource.skip = 0;
          this.dataSource.loadBooks(this.courseResource);
          this.dataSource.loadBooks(this.courseResource);
        });

    
        this.sub$.sink = this.isActiveSearchFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.courseResource.isActive = c;
          this.courseResource.skip = 0;
          this.dataSource.loadBooks(this.courseResource);
        })
    
      }
    
      ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            tap((c: any) => {
              this.courseResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
              this.courseResource.pageSize = this.paginator.pageSize;
              this.courseResource.orderBy = this.sort.active + ' ' + this.sort.direction;
              this.dataSource.loadBooks(this.courseResource);
            })
          )
          .subscribe();
    
      }

     getResourceParameter() {
        this.sub$.sink = this.dataSource.responseHeaderSubject$
          .subscribe((c: ResponseHeader) => {
            if (c) {
              this.courseResource.pageSize = c.pageSize;
              this.courseResource.skip = c.skip;
              this.courseResource.totalCount = c.totalCount;
            }
          });
      }

      editCourse(id){
         this.router.navigate(['/admin/course/manage', id])
      }


      deleteCourse(course){
        const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
        this.sub$.sink = this.commonDialogService
          .deleteConformationDialog(`${areU}:: ${course.title}`)
          .subscribe((flag: boolean) => {
            if (flag) {
              this.sub$.sink = this.courseService.deleteCourse(course)
                .subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                  this.dataSource.loadBooks(this.courseResource);
                });
            }
          });
      }
}