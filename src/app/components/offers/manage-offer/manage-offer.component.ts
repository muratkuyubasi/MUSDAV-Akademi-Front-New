import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { OfferService } from '../offers.service';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';


@Component({
    selector: 'app-manage-offer',
    templateUrl: 'manage-offer.component.html'
})

export class ManageOfferComponent extends BaseComponent implements OnInit {
    offer: any;
    offerForm: UntypedFormGroup;
    isEditMode = false;
    searchKey:string = '';
    offerUser:any;
    giveOffers:any[]=[];
    public keyword = 'courseName';
    courses: any[]=[];
    notFoundText='';
    courseResource:HomePageCourseResource
    courseTypes= [
        {
            id:1,
            title:'Uzaktan (Senkron) Eğitim'
        },
        {
            id:2,
            title:'Uzaktan (A-Senkron) Eğitim'
        },
        {
            id:3,
            title:'Yüzyüze Eğitim'
        }   
    ]
  
    constructor(
        private fb: UntypedFormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private offerService: OfferService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private translationService:TranslationService
    ) {
        super()
        this.courseResource = new HomePageCourseResource()
        this.courseResource.pageSize = 100;
        this.courseResource.isConfirmed = "1";
        this.courseResource.orderBy = 'Id desc'
     }

    ngOnInit() {
        this.createOfferForm()
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { offer: any }) => {
              if (data.offer) {
                console.log(data.offer.data.offerUsers)
                
                this.userOffer(data.offer.data.offerUsers)
                this.isEditMode = true;
                this.offerForm.patchValue(data.offer.data);
                this.offer = data.offer.data;
              }
            });

     }

     getCourses(){
        this.offerService.getCourses(this.courseResource).subscribe((resp:any)=>{
            this.courses = resp.body;
        })
    }

     createOfferForm(){
        this.offerForm = this.fb.group({
            openedCourseTypeId:['',Validators.required],
            courseId:[''],
            code:[''],
            offerTitle:['',Validators.required],
            offerDetail:['',Validators.required],
            offerKeywords:[''],
            offerPrice:['']
        })
     }

     offerBuildObject(){
        const val = this.offerForm.get('offerTitle').value;
        let offerTitle:any='';
        let courseId=null;

        if(val.id){
            offerTitle = val.courseName
            courseId = val.courseId
        }
        else{
            offerTitle =val
        }

        const offer = {
            id: this.offer ? this.offer.id : this.offerForm.get('id').value,
            code:this.offer ? this.offer.code:this.offerForm.get('code').value,
            openedCourseTypeId:this.offerForm.get('openedCourseTypeId').value,
            courseId:courseId,
            offerTitle:offerTitle,
            offerDetail:this.offerForm.get('offerDetail').value,
            offerKeywords:this.offerForm.get('offerKeywords').value,
            offerPrice:this.offerForm.get('offerPrice').value
        }
        return offer;
    }

    saveOffer(){
        if(this.offerForm.valid){
            const offer = this.offerBuildObject()
            if(this.isEditMode){
                this.offerService.updateOffer(offer).subscribe(resp=>{
                    if(resp.success){
                        this.toastrService.success(this.translationService.getValue('HOMEPAGE.OFFER_UPDATED'));
                        // this.offerForm.reset()
                    }
                    else{
                        this.toastrService.error(this.translationService.getValue('HOMEPAGE.OFFER_ADDED_ERROR'));
                    }
                    console.log(resp)
                })
            }
            else{
                this.offerService.addOffer(offer).subscribe(resp=>{
                    if(resp.success){
                        this.toastrService.success(this.translationService.getValue('HOMEPAGE.OFFER_ADDED'));
                        this.offerForm.reset()
                    }
                    else{
                        this.toastrService.error(this.translationService.getValue('HOMEPAGE.OFFER_ADDED_ERROR'));
                    }
                    console.log(resp)
                })
            }
            // this.getMyOffers()
        }
        else{
            this.offerForm.markAllAsTouched()
        }
        
    }

    userOffer(a){
        console.log(a)
        let userOffer = a.filter(o=>o.isGetOffer);
        if(userOffer.length>0){
            this.offerUser = userOffer[0];
            console.log(this.offerUser)
            // return true
        }
        let giveOffers = a.filter(o=>!o.isGetOffer)
        if(giveOffers.length>0){
            this.giveOffers = giveOffers
        }
        // return false;

      }
}