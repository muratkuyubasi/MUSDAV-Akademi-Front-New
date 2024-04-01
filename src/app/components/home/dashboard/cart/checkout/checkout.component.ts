import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { BaseComponent } from 'src/app/base.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserAuth } from '@core/domain-classes/user-auth';
import { UserService } from 'src/app/components/user/user.service';
import { User } from '@core/domain-classes/user';
import { DashboardService } from '../../dashboard.service';
import { CourseService } from '../../../services/course.service';


@Component({
    selector: 'app-checkout',
    templateUrl: 'checkout.component.html',
    styleUrls:['./checkout.component.scss','../../offers/get-offers/get-offer.component.scss','../../edit-profile/edit-profile.component.scss']
})

export class CheckoutComponent extends BaseComponent implements OnInit {
    
    appUserAuth:UserAuth=null;
    user:User;
    courses:any[]=[]
    userCourseCheck:any={
        isCourseRegister:false,
        isPayment:false,
        isRequiredPayment:false
    };
    public checkoutForm: UntypedFormGroup;
    public amount:  any;
    public payment: string = 'Stripe';

    constructor(
        public cartService:CartService,
        private dashboardService:DashboardService,
        private fb:UntypedFormBuilder,
        private courseService:CourseService,
        private userService:UserService
    ) {
        super()
        this.getProfile()
        this.createCheckoutForm()
     }

    ngOnInit() {
        this.cartService.cartItems.subscribe(response => this.courses = response);
        this.getTotal.subscribe(amount => this.amount = amount);

        console.log("Sepetteki KUrslar",this.courses)
       
     }

     getProfile(){
        this.userService.getUserProfile().subscribe((user: User)=>{
            this.user = user
            let userFormData= {
                firstName:this.user.firstName,
                lastName:this.user.lastName,
                phoneNumber:this.user.phoneNumber,
                address:this.user.address,
                email:this.user.email
            }
            this.checkoutForm.patchValue(userFormData)
            console.log(this.user)
        })
     }

     checkUserCourse(){
        this.courseService.checkUserCourse(this.appUserAuth.id,this.courses[0].id).subscribe((resp:any)=>{
            console.log(resp);
            this.userCourseCheck = resp
        })
    }

    createCheckoutForm(){
        this.checkoutForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]+')]],
            email: ['', [Validators.required, Validators.email]],
            address: ['', [Validators.required, Validators.maxLength(50)]],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', Validators.required],
            cardLastNumbers:['',[Validators.required]],
            expirationDate:['',[Validators.required]],
            // year:['',[Validators.required]],
            ccv:['',[Validators.required]]
            
          })
    }

    public get getTotal(): Observable<number> {
        return this.cartService.cartTotalAmount();
      }

      ccCheckOut(){
        if(this.checkoutForm.valid){
            let lastChar = this.checkoutForm.get('cardLastNumbers').value.toString();
            lastChar = lastChar.substr(lastChar.length -4)

            const checkout = this.createCheckoutObject()
            this.dashboardService.addOrder(checkout).subscribe((resp:any)=>{
                if(resp.success){
                    console.log(resp.data)
                    let payment ={
                        orderId:resp.data.id,
                        totalPrice:resp.data.totalPrice,
                        cardLastNumbers:lastChar,
                        isPayment:true
                    }
                    this.dashboardService.addPayment(payment).subscribe((resp)=>{
                        if(resp.success){
                            //BANKA ÖDEME İŞLEMİ ONAYI SONRASI TEMİZLEME
                            //ÖDEME SUCCEES SAYFASINA LOCALSTORAGE işlemini Taşı TAŞI 
                            localStorage.removeItem("cartItems");
                            alert("Ödeme İşlemi Başarılı")
                        }
                    })
                    
                }
                
                console.log(resp)
            })
            console.log(checkout)
    
        }
        else{
            this.checkoutForm.markAllAsTouched()
        }
      }

      createCheckoutObject(){
        
        let totalPrice:any;
        this.cartService.cartTotalAmount().subscribe((resp)=>{
            totalPrice = resp
        })

        let orderProducts:any[]=[];
        this.courses.forEach(element => {
            orderProducts.push({
                openedCourseStudentId:element.id,
                quantity:element.quantity,
                productPrice:element.coursePrice,
                orderId:0
            })
            
        });

        let checkout = {
            invoiceFirstName:this.checkoutForm.get('firstName').value,
            invoiceLastName:this.checkoutForm.get('lastName').value,
            invoicePhoneNumber:this.checkoutForm.get('phoneNumber').value,
            invoiceEmail:this.checkoutForm.get('email').value,
            invoiceAddress:this.checkoutForm.get('address').value,
            invoiceState:this.checkoutForm.get('state').value,
            invoiceCity:this.checkoutForm.get('city').value,
            invoicePostalCode:this.checkoutForm.get('postalCode').value,
            expirationDate:this.checkoutForm.get('expirationDate').value,
            ccv:this.checkoutForm.get('ccv').value,
            studentId:this.user.id,
            openedCourseStudentId:this.courses[0].id,
            totalPrice:totalPrice,
            productCount:this.courses.length,
            orderProducts:orderProducts
        }
        return checkout;
      }


}