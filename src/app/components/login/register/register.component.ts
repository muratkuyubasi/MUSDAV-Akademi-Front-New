import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FormBuilder, UntypedFormGroup,Validators } from '@angular/forms';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';
import localeTr from '@angular/common/locales/tr';
import { User } from '@core/domain-classes/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import moment from 'moment';

registerLocaleData(localeTr);

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['../login.component.scss'],
    providers:[]
})

export class RegisterComponent extends BaseComponent implements OnInit {

    identification:any;
    birthDay:any;
    registerFormGroup:UntypedFormGroup
    checkUserForm:UntypedFormGroup
    mUserData:any;
    step:number=1;
    message:any="";
    constructor(
        private securityService:SecurityService,
        private fb:FormBuilder,
        private toastr:ToastrService,
        private router:Router
    ) {
        super()
        this.createCheckUserForm()
     }

    ngOnInit() { }

    createCheckUserForm(){
        this.checkUserForm = this.fb.group({
            identification: ['', [Validators.required]],
          })
    }



    checkUser(){
        if(this.checkUserForm.valid){
            const id = this.checkUserForm.get('identification').value;
            this.identification = id;
            this.securityService.checkUser(id).subscribe((resp)=>{

                if(!resp.success){
                    this.message = resp.result;
                }
                else{
                    if(resp.result.SorgulaResponse){
                        this.message = resp.result.SorgulaResponse.SorgulaResult.SorguSonucu.BilesikKutukBilgileri.HataBilgisi.Aciklama
                    }
                    else{
                        this.mUserData = resp.result.TemelBilgisi;
                        this.checkUserForm.addControl('birthDay',new FormControl('',Validators.required))
                        this.step=2;    
    
                    }
                }

                // if(!resp){
                //     this.message = "Kimlik numarası ile daha önce kayıt yapılmış."
                // }
                // else if(resp.SorgulaResponse){
                //     this.message = resp.SorgulaResponse.SorgulaResult.SorguSonucu.BilesikKutukBilgileri.HataBilgisi.Aciklama
                // }
                // else{
                //     this.mUserData = resp.TemelBilgisi;
                //     this.checkUserForm.addControl('birthDay',new FormControl('',Validators.required))
                //     this.step=2;    

                // }
                // if(resp){
                //     this.mUserData = resp;
                //     this.checkUserForm.addControl('birthDay',new FormControl('',Validators.required))
                //     this.step=2;    
                // }
                
              })
        }
    }

    confirmation(){
        let formData = Object.assign({},this.checkUserForm.value);
        var str1 = new String(formData.birthDay.replace(0,""));
        const mernisBD = String(this.mUserData.DogumTarih.Gun)+String(this.mUserData.DogumTarih.Ay)+String(this.mUserData.DogumTarih.Yil);
        this.birthDay = String(this.mUserData.DogumTarih.Yil)+"-"+String(this.mUserData.DogumTarih.Ay)+"-"+String(this.mUserData.DogumTarih.Gun)
        var index = str1.localeCompare(mernisBD)
         if(index==0){
            this.checkUserForm.addControl('email',new FormControl('',[Validators.required,Validators.email]))
            this.checkUserForm.addControl('phoneNumber',new FormControl('',[Validators.required]))
            this.checkUserForm.addControl('password',new FormControl('',[Validators.required]))
            this.checkUserForm.addControl('isDisabled',new FormControl(false))
            this.step=3;
           
         }
         else{
            this.checkUserForm.controls['birthDay'].setErrors({'incorrect': true});
            // .markAsDirty()
            // this.checkUserForm.get('birthDay').updateValueAndValidity()
            this.checkUserForm.markAllAsTouched()
         }
       
    }

    
    onRegisterSubmit(){

        const bd = formatDate(this.birthDay,'yyyy-MM-dd',"tr");
        var d = moment(this.birthDay,"yyyy-MM-dd").toLocaleString();
   

        if(this.checkUserForm.valid){
            const registerData = {
                userName:this.identification,
                email:this.checkUserForm.get('email').value,
                password:this.checkUserForm.get('password').value,
                firstName:this.mUserData.Ad,
                lastName:this.mUserData.Soyad,
                fatherName:this.mUserData.BabaAd,
                motherName:this.mUserData.AnneAd,
                identification:this.identification,
                phoneNumber:this.checkUserForm.get('phoneNumber').value,
                sex:this.mUserData.Cinsiyet.Aciklama,
                birthDay:this.birthDay,
                // city:this.mUserData.KayitYeriBilgisi.Aciklama,
                isDisabled:this.checkUserForm.get('isDisabled').value,
                isActive:true,
                userRoles:[{roleId:'d7b7d555-2fa8-45bb-a3e8-e8320d272f99'}]

            }
            this.securityService.registerUser(registerData).subscribe((resp)=>{
                this.toastr.success("Kayıt işleminiz tamamlandı.")
                
    this.router.navigate(['/admin']);
                var userObject:any = {
                    userName:registerData.userName,
                    password:registerData.password
                }
                
            })
            
        }
    }
}