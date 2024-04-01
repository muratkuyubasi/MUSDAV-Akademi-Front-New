import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@core/domain-classes/role';
import { User } from '@core/domain-classes/user';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from 'src/app/components/user/user.service';
import { OpenedCoursesService } from '../../../opened-courses.service';

@Component({
    selector: 'app-add-student',
    templateUrl: 'add-student.component.html'
})

export class AddStudentComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    userForm: UntypedFormGroup;
    selectedRoles: Role[] = [];
    isEditMode = false;
    users:any[]=[];
    user:any;
    email:any;
    checkUserResult:any;
    openedCourseStudents:any[]=[]
    

    constructor(
        private fb: UntypedFormBuilder,
        private courseService:OpenedCoursesService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService
    ) {
        super()
     }

    ngOnInit() {
        this.getCourseStudents()
        this.createUserForm();
     }

     checkUser(){
      this.courseService.checkUser(this.course.id,this.email).subscribe((resp:any)=>{
        if(resp.success){
          this.isEditMode = false;
          this.checkUserResult = "Sistemde Kayıtlı Kullanıcı"
          this.users = resp.result.data
        }
        else{
          this.isEditMode = true;
          this.checkUserResult = "Sistemde Kayıtlı Kullanıcı Bilgisi Bulunamadı"
          this.userForm.get('email').patchValue(this.email)
        }
      })
     }

    createUserForm() {
        this.userForm = this.fb.group({
        //   id: [''],
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          phoneNumber: ['', [Validators.required]],
          password: [''],
          confirmPassword: [''],
          address: [''],
          isActive: [true],
        }, {
          validator: this.checkPasswords
        });
      }

      checkPasswords(group: UntypedFormGroup) {
        let pass = group.get('password').value;
        let confirmPass = group.get('confirmPassword').value;
        return pass === confirmPass ? null : { notSame: true }
      }

      saveUser() {
        if (this.userForm.valid) {
          const user = this.createBuildObject();
            this.sub$.sink = this.userService.registerUser(user).subscribe((resp) => {
              this.toastrService.success(this.translationService.getValue('USER_CREATED_SUCCESSFULLY'));
              this.checkUserResult = "Kaydı Tamamlanan Öğrenci Bilgisi"
              this.email = user.email
              this.user = resp.data;
              this.checkUser()
              
            //   this.router.navigate(['/admin/users']);
            });
         
        } else {
          this.userForm.markAllAsTouched();
        }
      }
    
      createBuildObject(): any {
        const user: any = {
          firstName: this.userForm.get('firstName').value,
          lastName: this.userForm.get('lastName').value,
          email: this.userForm.get('email').value,
          phoneNumber: this.userForm.get('phoneNumber').value,
          password: this.userForm.get('password').value,
          userName: this.userForm.get('email').value,
          isActive: true,
          IsDisabled:false,
          address: this.userForm.get('address').value,
          userRoles: [{
            roleId:"cb2ef8de-afac-44d1-8cca-cf93ea034fae"
          }]
        }

        return user;
      }

      getSelectedRoles() {
        const roles = {
            roleId: "cb2ef8de-afac-44d1-8cca-cf93ea034fae"
        }

        return roles;
      }

      saveCourseStudent(user){
        const student = {
          userId:user.userId,
          openedCourseId:this.course.id,
          email:user.userName,
          phoneNumber:user.phoneNumber,
          fullName:user.firstName+" "+user.lastName
        }
        this.courseService.addOpenedCourseStudent(student).subscribe(resp=>{
          this.getCourseStudents()
        })
      }

      getCourseStudents(){
        this.courseService.getCourseStudents(this.course.id).subscribe((resp:any)=>{
          this.openedCourseStudents = resp.data
        })
      }


}