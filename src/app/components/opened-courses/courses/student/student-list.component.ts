import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { OpenedCoursesService } from '../../opened-courses.service';
import { delay } from 'rxjs';

@Component({
    selector: 'app-student-list',
    templateUrl: 'student-list.component.html'
})

export class StudentListComponent implements OnInit {
    @Input() courseId:any;
    @Input() student:any;

    @Input()  openedCourseStudents:any[]=[]

    displayedColumns: string[] = ['fullName', 'email', 'phone','option'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    constructor(
        private courseService:OpenedCoursesService
    ) { }

    ngOnInit() {
        // this.getCourseStudents()
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        delay(3000)
        this.dataSource = new MatTableDataSource(this.openedCourseStudents)

        
     }

     getCourseStudents(){
        this.courseService.getCourseStudents(1).subscribe((resp:any)=>{
          this.dataSource = new MatTableDataSource(resp.data)
          this.openedCourseStudents = resp.data
        })
      }

      studentDetail(user){
        console.log(user)
      }
}