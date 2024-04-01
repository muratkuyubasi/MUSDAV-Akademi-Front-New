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
import { OfferResource } from '@core/domain-classes/offer-resources';

@Component({
    selector: 'app-give-offer',
    templateUrl: 'give-offer.component.html',
    styleUrls:['../get-offers/get-offer.component.scss','../../edit-profile/edit-profile.component.scss']
})

export class GiveOfferComponent extends BaseComponent implements OnInit {
    appUserAuth:UserAuth = null;
    isEditMode:boolean=false;
    offerResource:OfferResource
    offerForm:UntypedFormGroup
    offer:any;
    offers:any[]=[];
    isBeforeOffer:boolean=false
    beforeOffer:any;

    constructor(
        private dashboardService:DashboardService,
        private fb:UntypedFormBuilder,
        private toastrService:ToastrService,
        private translationService:TranslationService,
        private securityService:SecurityService,
        private commonDialogService:CommonDialogService
    ) {
        super()
        this.offerResource = new OfferResource()
        this.offerResource.pageSize = 50;
        this.offerResource.offerStatus = "1";
        this.offerResource.orderBy = 'Id desc'
        this.setTopLogAndName()
     }

    ngOnInit() {
        this.getOffers()
        this.createOfferForm()
     }


    getOffers(){
        this.dashboardService.getOffers(this.offerResource).subscribe((resp:any)=>{
            this.offers = resp.body;

        })
    }

    createOfferForm(){
        this.offerForm = this.fb.group({
            userId:[this.appUserAuth.id],
            offerId:[''],
            offerPrice:['',Validators.required],
            discountedPrice:[''],
            validityDate:[''],
            isActive:[true]
        })
    }

    showOffer(offer){
        this.offer = offer
        this.isEditMode = true
        console.log(offer);
        if(offer.offerUsers.length>0){
            let offerUser = offer.offerUsers.filter(item=>item.userId===this.appUserAuth.id);
            if(offerUser.length>0){
                this.isBeforeOffer=true
                this.beforeOffer = {
                    offerPrice:offerUser[0].offerPrice,
                    createdDate:offerUser[0].createdDate,
                    validityPeriod:offerUser[0].validityPeriod

                }
                console.log(this.beforeOffer)

            } 
        }
    }

    saveOffer(){
        
        if(this.offerForm.valid){
            const offer = this.offerBuildObject()
            this.dashboardService.addOfferUser(offer).subscribe(resp=>{
                if(resp.success){
                    this.toastrService.success(this.translationService.getValue('HOMEPAGE.OFFER_ADDED'));
                    this.offerForm.reset()
                }
                else{
                    this.toastrService.error(this.translationService.getValue(resp.errors[0]));
                }
                console.log(resp)
            })
        }
        else{
            this.offerForm.markAllAsTouched()
        }
    }

    offerBuildObject(){
        const offer = {
            offerId:this.offer ? this.offer.id : this.offerForm.get('id').value,
            userId:this.appUserAuth.id,
            validityDate:Number(this.offerForm.get('validityDate').value),
            offerPrice:Number(this.offerForm.get('offerPrice').value),
            isActive:true
        }
        console.log(offer)
        return offer;
    }

    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
          }
        })
    }
}