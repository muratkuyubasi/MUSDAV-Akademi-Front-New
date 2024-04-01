import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-instructor-course-detail',
    templateUrl: 'course-detail.component.html',
    styleUrls:['./course-details-page.component.scss']
})

export class InstructorCourseDetailComponent extends BaseComponent implements OnInit {
    
    appUserAuth:UserAuth= null;
    course:any;
    section: any;
    isEditMode = false;    
    detailForm: UntypedFormGroup;


    constructor(
        private securityService:SecurityService,
        private activeRoute: ActivatedRoute
    ) {
        super()
     }

    ngOnInit() {
      this.setTopLogAndName()
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { course: any }) => {
              if (data.course) {
                this.course = data.course.data;
                this.isEditMode=true
                
              }
          });
     }

     setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
          }
          else{
          }
        })
      }

       // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }
}