import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '@core/security/security.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserAuth } from '@core/domain-classes/user-auth';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls:['register.component.scss']
})

export class RegisterComponent extends BaseComponent implements OnInit {
    appUserAuth: UserAuth = null;
    userRegisterForm:UntypedFormGroup;
    message:any;
    successCode:number;
    user:any;

    constructor(
        private activeRoute: ActivatedRoute,
        private router:Router,
        private securityService:SecurityService,
        private courseService:CourseService,
        private fb:UntypedFormBuilder,
        private toastr:ToastrService
        
    ){
        super()
        this.setTopLogAndName()
        
    }

    ngOnInit() {
     this.createUserRegisterForm()
    }

    createUserRegisterForm(){
        this.userRegisterForm = this.fb.group({
            firstName:['',Validators.required],
            lastName:['',Validators.required],
            email:['',[Validators.required,Validators.email]],
            password:['',[
                Validators.required,
                Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,}'),
                // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}') //ÖZEL KARAKTER Büyük KÜçük Harf Rakam
            ]]
        })
    }



    registerUser(){
        if(this.userRegisterForm.valid){
            const user = this.createUserRegisterObject()
            this.securityService.registerUser(user).subscribe((resp)=>{
                console.log(resp)
                if(resp.success){
                    this.user = resp.data;
                    this.securityService.setLogin(resp.data);
                    if(resp.success){
                        this.toastr.success('Kaydınız tamamlandı');
                        this.router.navigate(['/dashboard']);
                    }
                    else{
                        this.toastr.error('Bir hata oluştu.');
                    }
                    
                }
                else{
                    if(resp.statusCode==409){
                        this.successCode = 409;
                        this.message = `${resp.errors[0]} <a href="/forgot-password">Şifrenizi mi unuttunuz?</a>`
                    }
                }
                // this.toastr.success("Kayıt işleminiz tamamlandı.")                
            })

        }
        else{
            this.userRegisterForm.markAllAsTouched()
        }
    }

    createUserRegisterObject(){
        const userFormData = {
            userName:this.userRegisterForm.get('email').value,
            email:this.userRegisterForm.get('email').value,
            firstName:this.userRegisterForm.get('firstName').value,
            lastName:this.userRegisterForm.get('lastName').value,
            password:this.userRegisterForm.get('password').value,
            isActive:true,
            userRoles:[{roleId:'CB2EF8DE-AFAC-44D1-8CCA-CF93EA034FAE'}], //ÖĞRENCİ
            profile:{
                nickName:this.userRegisterForm.get('firstName').value
            }
        }
        return userFormData;
    }

    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            console.log(c);
          }
        })
      }
  
}