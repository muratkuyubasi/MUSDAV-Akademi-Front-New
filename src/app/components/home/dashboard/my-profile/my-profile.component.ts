import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../dashboard.service';
import { UserService } from 'src/app/components/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '@core/security/security.service';
import { TranslationService } from '@core/services/translation.service';
import { User } from '@core/domain-classes/user';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/components/user/change-password/change-password.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss','../edit-profile/edit-profile.component.scss']
})
export class MyProfileComponent extends BaseComponent implements OnInit {

  isEditMode:boolean=false;
  user: User;
  profile:any={};
  imgURL: any;
  fileSelected: File;

  userForm:UntypedFormGroup

  constructor(
    private userService:UserService,
    private dashboardService:DashboardService,
    private toastrService:ToastrService,
    private translationService:TranslationService,
    private securityService:SecurityService,
    private fb:UntypedFormBuilder,
    private dialog: MatDialog,
  ){
    super()
  }
  
  ngOnInit() {
    this.createUserForm();
    this.sub$.sink = this.userService.getUserProfile().subscribe((user: User) => {
      this.user = user;
      // this.profile = user;
      
      if (this.user) {
        if (this.user.profilePhoto) {
          this.imgURL = environment.apiUrl + this.user.profilePhoto;
        }
      }
    });
    this.getProfile()
  }

  getProfile(){
    this.dashboardService.getStudentProfile().subscribe((resp:any)=>{
      console.log(resp)
      this.profile = resp.data;
      this.imgURL = resp.data.profilePhoto
      

      if(this.profile.birthDay){
        let dateTime = moment(this.profile.birthDay).format("yyyy-MM-DD")
        this.profile.birthDay = dateTime
      }
      this.userForm.patchValue(this.profile);
      console.log("FORM ALANLARI",this.userForm.value)
    })
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{value:'',disabled:true}, [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(new RegExp(/^(\d{10})$/))]],
      address: [''],
      birthDay:[''],
      gender:[''],
      cityName:[''],
      countryName:['']


    });
  }

  updateProfile() {
    if (this.userForm.valid) {
      const user = this.createBuildObject();


      console.log("FORM DATA,",user)

      this.sub$.sink = this.userService.updateUserProfile(user)
        .subscribe((user: any) => {
          this.toastrService.success(this.translationService.getValue('PROFILE_UPDATED_SUCCESSFULLY'));
          this.securityService.updateUserProfile(user);
        });
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_ENTER_PROPER_DATA'))
    }
  }

  createBuildObject(): any {
    const user: any = {
      id: this.userForm.get('id').value,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      userName: this.userForm.get('email').value,
      address: this.userForm.get('address').value,
      userProfile:{
        id:this.profile.profileId,
        birthDay:this.userForm.get('birthDay').value,
        gender:this.userForm.get('gender').value,
        city:this.userForm.get('cityName').value,
        country:this.userForm.get('countryName').value
      }
    }
    return user;
  }

  fileEvent($event) {
    this.fileSelected = $event.target.files[0];
    if (!this.fileSelected) {
      return;
    }
    const mimeType = this.fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileSelected);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
      const formData = new FormData();
      formData.append(this.fileSelected.name, this.fileSelected);
      this.userService.updateProfilePhoto(formData).subscribe((user: User) => {
        this.toastrService.success(this.translationService.getValue('PROFILE_PHOTO_UPDATED_SUCCESSFULLY'));
        this.imgURL = reader.result;
        this.securityService.updateUserProfile(user);
        $event.target.value = '';
      });
    }
  }

  changePassword(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '350px',
      data: Object.assign({}, this.user)
    });
  }
}
