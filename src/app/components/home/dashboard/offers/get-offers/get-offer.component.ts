import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../../dashboard.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { SecurityService } from '@core/security/security.service';
import { UserAuth } from '@core/domain-classes/user-auth';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';

@Component({
    selector: 'app-get-offer',
    templateUrl: 'get-offer.component.html',
    styleUrls:['./get-offer.component.scss','../../edit-profile/edit-profile.component.scss']
})

export class GetOfferComponent extends BaseComponent implements OnInit {

    appUserAuth:UserAuth = null;

    searchKey:string = '';
    public keyword = 'courseName';
    courses: any[]=[];
    notFoundText='';
    isEditMode:boolean=false;

    courseResource:HomePageCourseResource


    offerForm:UntypedFormGroup
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
    offer:any;
    myOffers:any[]=[];

    constructor(
        private dashboardService:DashboardService,
        private fb:UntypedFormBuilder,
        private toastrService:ToastrService,
        private translationService:TranslationService,
        private securityService:SecurityService,
        private commonDialogService:CommonDialogService
    ) {
        super()
        this.courseResource = new HomePageCourseResource()
        this.courseResource.pageSize = 100;
        this.courseResource.isConfirmed = "1";
        this.courseResource.orderBy = 'Id desc'
        this.setTopLogAndName()
     }

    ngOnInit() {
        this.createOfferForm()
        this.getCourses()
        this.getMyOffers()

    }

    getCourses(){
        this.dashboardService.getCourses(this.courseResource).subscribe((resp:any)=>{
            this.courses = resp.body;
        })
    }

    getMyOffers(){
        this.dashboardService.getMyOffers(this.appUserAuth.id).subscribe((resp:any)=>{
            this.myOffers = resp.body;
            console.log(this.myOffers)

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
                this.dashboardService.updateOffer(offer).subscribe(resp=>{
                    if(resp.success){
                        this.toastrService.success(this.translationService.getValue('HOMEPAGE.OFFER_UPDATED'));
                        this.offerForm.reset()
                    }
                    else{
                        this.toastrService.error(this.translationService.getValue('HOMEPAGE.OFFER_ADDED_ERROR'));
                    }
                    console.log(resp)
                })
            }
            else{
                this.dashboardService.addOffer(offer).subscribe(resp=>{
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
            this.getMyOffers()
        }
        else{
            this.offerForm.markAllAsTouched()
        }
        
    }
    updateOffer(offer){
        this.offer = offer
        this.isEditMode = true

        console.log(offer)
        this.offerForm.patchValue(offer)

    }

    deleteOffer(offer){

        this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${offer.title}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
            this.dashboardService.deleteOffer(offer.id).subscribe(resp=>{
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                this.getMyOffers()
               })
          
        }
      });

        
    }

    showOffer(offer){

    }

    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
          }
        })
    }



}