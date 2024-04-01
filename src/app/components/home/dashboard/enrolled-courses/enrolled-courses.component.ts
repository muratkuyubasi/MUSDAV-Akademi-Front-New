import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-enrolled-courses',
  templateUrl: './enrolled-courses.component.html',
  styleUrls: ['./enrolled-courses.component.scss'],

})
export class EnrolledCoursesComponent extends BaseComponent implements OnInit {

  courses:any[]=[];

  constructor(
    private dashboardService:DashboardService
  ){
    super()
  }

  ngOnInit() {
    this.getStudentCourses()
  }

  getStudentCourses(){
    this.dashboardService.getStudentCourses().subscribe((resp:any)=>{
      // alert("GetStudentCoursesQueryHandler üzerinde kursun ödeme kontrolü yapılıp listeye yansıtılmalı")
      this.courses = resp.data

    })
  }
}
