import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';

@Component({
    selector: 'app-instructor-course-list',
    templateUrl: 'course-list.component.html'
})

export class CourseListComponent extends BaseComponent implements OnInit {
    appUserAuth:UserAuth = null;
    userCounter:any;
    courses:any[]=[];

    constructor(
        private instService:InstructorService,
        private securityService:SecurityService
    ) {
     super()
     this.setTopLogAndName()

     }

    ngOnInit() {
        this.getCourses()
    }

    getCourses(){
        this.instService.getInstructorCourses().subscribe((resp:any)=>{
            this.courses = resp.data
        })
    }


    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$
          .subscribe(c => {
            if (c) {
              this.appUserAuth = c;
              console.log("User",this.appUserAuth)
             
            }
          })
      }
}