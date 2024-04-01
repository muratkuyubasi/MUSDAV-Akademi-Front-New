import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '@core/security/security.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserAuth } from '@core/domain-classes/user-auth';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../dashboard/cart/cart.service';
import * as moment from 'moment';

@Component({
    selector: 'app-register-student',
    templateUrl: 'register-student.component.html',
    styleUrls:['register-component.scss']
})

export class RegisterStudentComponent extends BaseComponent implements OnInit {
    appUserAuth: UserAuth = null;
    course:any;
    courseRecord:any;
    userRegisterForm:UntypedFormGroup;
    courseRegisterForm:UntypedFormGroup;
    message:any;
    successCode:number;
    showUserForm:boolean=true;
    showCourseForm:boolean=false;
    user:any;
    isDefaultStudent:boolean=false;
    userCourseCheck:any={
        isCourseRegister:false,
        isPayment:false,
        isRequiredPayment:false
    };
    studentLastCourse:any;

    constructor(
        private activeRoute: ActivatedRoute,
        private router:Router,
        private securityService:SecurityService,
        private courseService:CourseService,
        private fb:UntypedFormBuilder,
        private toastr:ToastrService,
        public cartService:CartService
        
    ){
        super()
        this.setTopLogAndName()
        this.getUserLastRecord();
        
    }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { course: any }) => {
              if (data.course) {
                this.course = data.course;
                this.createUserRegisterForm()
                this.createCourseRegisterForm()
              }
          });
    }

    setCourseData(){
       this.courseRecord =  this.course.openedCourseRecords.filter(item=>item.languageCode === this.defaultLang$)[0]
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
                if(resp.success){
                    this.user = resp.data;
                    this.showCourseForm = true;
                    this.showUserForm = false;
                    this.securityService.setLogin(resp.data);

                    this.courseRegisterForm.get('fullName').patchValue(resp.data.firstName+" "+resp.data.lastName)
                    this.courseRegisterForm.patchValue(resp.data)
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

    createCourseRegisterForm(){
        this.courseRegisterForm = this.fb.group({
            userId:[''],
            openedCourseId:[this.course?.id],
            fullName:[{value:this.appUserAuth?.firstName+" "+this.appUserAuth?.lastName, disabled:true},Validators.required],
            identificationNo:[],
            fatherName:[],
            motherName:[],
            gender:['',Validators.required],
            birthDay:['',Validators.required],
            email:[{value:this.appUserAuth?.email, disabled:true},[Validators.required,Validators.email]],
            phoneNumber:[this.appUserAuth?.phoneNumber, Validators.required],
            address:['',Validators.required],
            cityName:['',Validators.required],
            countryName:['',Validators.required],
            openedCourseBranchId:[''],
            differentUser:[false]
        })
        if(this.course?.openedCourseBrancheCount>1){
            this.courseRegisterForm.get('openedCourseBranchId').setValidators([Validators.required])
           
        }
    }


    registerUserCourse(){
        if(this.courseRegisterForm.valid){
            const userForm = this.createCourseRegisterObject()
            this.courseService.addStudentToCourse(userForm).subscribe(resp=>{
                if(resp.success){
                    this.checkUserCourse()
                    this.toastr.success('Kurs kaydınız tamamlandı');
                    
                }
                else{
                    this.toastr.success('Kursa daha önce kaydınız bulunmaktadır.');
                }
            })
        }
        else{
            this.courseRegisterForm.markAllAsTouched()
        }
    }

    createCourseRegisterObject(){
        let courseForm:any ={}
        
            courseForm.userId=this.appUserAuth?.id,
            courseForm.openedCourseId=this.course?.id,

            courseForm.fullName=
            this.isDefaultStudent ? this.courseRegisterForm.get("fatherName").value :
            this.appUserAuth?.firstName+" "+this.appUserAuth?.lastName,
            
            courseForm.email=
            this.isDefaultStudent ? this.appUserAuth.userName :
            this.courseRegisterForm.get("email").value,

            courseForm.fatherName= this.isDefaultStudent ? this.appUserAuth?.firstName+" "+this.appUserAuth?.lastName : '',

            courseForm.motherName=this.courseRegisterForm.get("motherName").value,
            
            courseForm.openedCourseBranchId= this.course.openedCourseBrancheCount > 1 ?
            this.courseRegisterForm.get("openedCourseBranchId").value : 0

            courseForm.phoneNumber= this.courseRegisterForm.get("phoneNumber").value,         
            courseForm.identificationNo=this.courseRegisterForm.get("identificationNo").value,
            courseForm.gender=this.courseRegisterForm.get("gender").value,
            courseForm.birthDay=this.courseRegisterForm.get("birthDay").value,
            courseForm.address=this.courseRegisterForm.get("address").value,
            courseForm.cityName=this.courseRegisterForm.get("cityName").value,
            courseForm.countryName=this.courseRegisterForm.get("countryName").value
            
        
        return courseForm;
    }

    defaultStudent(e){
        if(e.target.checked){
            this.isDefaultStudent = true;
            this.courseRegisterForm.get('fullName').enable()
            this.courseRegisterForm.get('fullName').reset()
            
            this.courseRegisterForm.get('email').enable()
            this.courseRegisterForm.get('email').reset()
        }
        else{
            this.isDefaultStudent = false;
            this.courseRegisterForm.get('fullName').patchValue(this.appUserAuth?.firstName+" "+this.appUserAuth?.lastName)
            this.courseRegisterForm.get('fullName').disable()

            this.courseRegisterForm.get('email').patchValue(this.appUserAuth?.userName)
            this.courseRegisterForm.get('email').disable()

            this.courseRegisterForm.get('phoneNumber').patchValue(this.appUserAuth?.phoneNumber)
        }

    }
   
    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            this.showUserForm = false;
            this.showCourseForm = true;
          }
        })
      }

    getUserLastRecord(){
        this.courseService.getLastCourse().subscribe((resp:any)=>{
            if(resp.success){
                let birthDay = moment(resp.data.birthDay).format("yyyy-MM-DD")
                this.studentLastCourse = resp.data;
                this.courseRegisterForm.get('address').patchValue(resp.data.address);
                this.courseRegisterForm.get('cityName').patchValue(resp.data.cityName);
                this.courseRegisterForm.get('countryName').patchValue(resp.data.countryName);
                this.courseRegisterForm.get('gender').patchValue(resp.data.gender);
                this.courseRegisterForm.get('phoneNumber').patchValue(resp.data.phoneNumber);
                this.courseRegisterForm.get('birthDay').patchValue(birthDay);
            }
        })
    }
    checkUserCourse(){
        this.courseService.checkUserCourse(this.appUserAuth.id,this.course.id).subscribe((resp:any)=>{
            this.userCourseCheck = resp
            if(resp.isRequiredPayment){
                if(this.course?.coursePrice !='HOMEPAGE.FREE'){
                    let courseData = {
                        id:this.course.id,
                        courseName:this.course.title,
                        coursePrice:this.course.coursePrice =="HOMEPAGE.FREE" ? 0 :this.course.coursePrice,
                        quantity:1,
                        currency:this.course.priceSymbol,
                        code:this.course.code,
                    }
                    
                    this.cartService.addToCart(courseData);

                    this.router.navigate(['/dashboard/cart']);
                }
                else{
                    this.router.navigate(['/dashboard']);
                }

            }
            else{
                this.router.navigate(['/dashboard']);
            }
        })
    }
  
}