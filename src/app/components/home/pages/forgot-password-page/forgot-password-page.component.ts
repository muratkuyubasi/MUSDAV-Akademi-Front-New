import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '@core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent extends BaseComponent implements OnInit {

  checkUserForm:UntypedFormGroup;
  message:any="";
  
  constructor(
        private securityService:SecurityService,
        private fb:FormBuilder,
        private toastr:ToastrService,
        private router:Router
  ){
    super()
    this.checkUserForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
    })
  }

  ngOnInit(): void {
    
  }

  checkUser(){
    if(this.checkUserForm.valid){
        const id = this.checkUserForm.get('email').value;
        
        const forgotPassword = {
            userName:id,
            url:""
        }
        this.securityService.forgotPassword(forgotPassword).subscribe((resp)=>{
            if(resp.success){
                this.toastr.success("Şifreniz sistemde kayıtlı e-posta adresinize gönderilmiştir.")
                this.router.navigate(['/dashboard']);
            }
            else{
                if(resp.errors[0]="UsernotFound"){
                    this.toastr.error("Girmiş olduğunuz e-posta ile kayıtlı kullanıcı bulunamadı.")
                }
                else{
                    this.toastr.error("Hata oluştu lütfen daha sonra tekrar deneyiniz")

                }
            }
        })
    }
    else{
        this.checkUserForm.markAllAsTouched()
    }
}
}
