import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../../dashboard.service';
import { SecurityService } from '@core/security/security.service';
import { UserAuth } from '@core/domain-classes/user-auth';

@Component({
    selector: 'app-manage-instructor',
    templateUrl: 'manage-instructor.component.html',
    styleUrls:['../../edit-profile/edit-profile.component.scss']
})

export class ManageInstructorComponent extends BaseComponent implements OnInit {
    
    appUserAuth:UserAuth=null;
    instructorForm:UntypedFormGroup;

    constructor(
        private dashboardService:DashboardService,
        private securityService:SecurityService,
        private fb:UntypedFormBuilder
    ) {
        super()
        this.setTopLogAndName()
     }

    ngOnInit() {
        this.createInstructorForm()
     }

     createInstructorForm(){
        this.instructorForm = this.fb.group({
            userId:[this.appUserAuth?.id],
            firstName:[{value:this.appUserAuth?.firstName, disabled:true}],
            lastName:[{value:this.appUserAuth?.lastName, disabled:true}],
            email:[{value:this.appUserAuth?.email, disabled:true}],
            phoneNumber:[this.appUserAuth?.phoneNumber,Validators.required],
            keywords:['',Validators.required],
            biblio:['',Validators.required],
            facebook:[''],
            instagram:[''],
            linkedin:[''],
            twitter:[''],
        })
     }

     saveInstructor(){
        if(this.instructorForm.valid){
            const instructor = this.createInstructorObject()
            this.dashboardService.addInstructor(instructor).subscribe((resp:any)=>{

            })
        }
        else{

        }
     }

     createInstructorObject(){
        const instructor = {
            userId:this.appUserAuth?.id,
            firstName:this.appUserAuth?.firstName,
            lastName:this.appUserAuth?.lastName,
            email:this.appUserAuth?.email,
            contactPhone:this.instructorForm.get('phoneNumber').value,
            keywords:this.instructorForm.get('keywords').value,
            biblio:this.instructorForm.get('biblio').value,
            facebook:this.instructorForm.get('facebook').value,
            instagram:this.instructorForm.get('instagram').value,
            linkedin:this.instructorForm.get('linkedin').value,
            twitter:this.instructorForm.get('twitter').value,
            userRoles:[
                {roleId:'185C414B-9C32-4BB1-A1F4-9A3EA0A1AB1B'}],
        }
        return instructor
     }

     setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            console.log(c)
          }
        })
      }
}