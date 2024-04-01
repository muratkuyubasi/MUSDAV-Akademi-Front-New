import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { OfferService } from '../offers.service';
import { OfferResource } from '@core/domain-classes/offer-resources';
import { UntypedFormBuilder, UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { OfferDataSource } from '../offers-datasource';
import { ResponseHeader } from '@core/domain-classes/response-header';



@Component({
    selector: 'app-offer-list',
    templateUrl: 'offer-list.component.html'
})

export class OfferListComponent extends BaseComponent implements OnInit {
    dataSource: OfferDataSource;
    displayedColumns: string[] = ['action','offerUser', 'title', 'course',  'offers','isActive'];
    footerToDisplayed: string[] = ["footer"];
    isLoadingResults = true;
    offerResource:OfferResource;
    loading$: Observable<boolean>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input') input: ElementRef;

    titleFilterCtl: UntypedFormControl = new UntypedFormControl('');
    // fullNameFilterCtl: UntypedFormControl = new UntypedFormControl('');
    // phoneNumberSearchFilterCtl: UntypedFormControl = new UntypedFormControl('');
    isActiveSearchFilterCtl: UntypedFormControl = new UntypedFormControl(true);
  
    
    offerForm:UntypedFormGroup
    offer:any;
    offers:any[]=[];
    offerUser:any;

    constructor(
        private offerService:OfferService,
        private fb:UntypedFormBuilder,
        private toastrService:ToastrService,
        private translationService:TranslationService,
        private commonDialogService:CommonDialogService,
        private router: Router
    ) {
        super()
        this.offerResource = new OfferResource()
        this.offerResource.pageSize = 50;
        this.offerResource.isActive = "1";
        this.offerResource.offerStatus = "";
        this.offerResource.orderBy = 'Id desc'
     }

    ngOnInit() {
        this.dataSource = new OfferDataSource(this.offerService);
        this.dataSource.loadOffers(this.offerResource);
        this.getResourceParameter();
        this.filterLogic();
     }

     getResourceParameter() {
        this.sub$.sink = this.dataSource.responseHeaderSubject$
          .subscribe((c: ResponseHeader) => {
            if (c) {
              this.offerResource.pageSize = c.pageSize;
              this.offerResource.skip = c.skip;
              this.offerResource.totalCount = c.totalCount;
            }
          });
      }

      filterLogic() {
        this.sub$.sink = this.titleFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.offerResource.title = c;
          this.offerResource.skip = 0;
          this.dataSource.loadOffers(this.offerResource);
        });
    
        // this.sub$.sink = this.fullNameFilterCtl.valueChanges.pipe(
        //   debounceTime(400),
        //   distinctUntilChanged()
        // ).subscribe(c => {
        //   if (c) {
        //     const name = c.trim().split(' ');
        //     // this.offerResource.first_name = name[0];
        //     if (name.length > 1)
        //     //   this.offerResource.last_name = name[1];
        //     this.offerResource.skip = 0;
        //   } else {
        //     // this.offerResource.first_name = '';
        //     // this.offerResource.last_name = '';
        //     this.offerResource.skip = 0;
        //   }
        //   this.dataSource.loadOffers(this.offerResource);
        // });
    
        // this.sub$.sink = this.phoneNumberSearchFilterCtl.valueChanges.pipe(
        //   debounceTime(400),
        //   distinctUntilChanged()
        // ).subscribe(c => {
        // //   this.offerResource.phone_number = c;
        //   this.offerResource.skip = 0;
        //   this.dataSource.loadOffers(this.offerResource);
        // });
    
        this.sub$.sink = this.isActiveSearchFilterCtl.valueChanges.pipe(
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe(c => {
          this.offerResource.isActive = c;
          this.offerResource.skip = 0;
          this.dataSource.loadOffers(this.offerResource);
        })
    
      }

      detail(id){
        this.router.navigate(['/admin/offers/manage', id])
      }

      userOffer(a){
        let userOffer = a.filter(o=>o.isGetOffer);
        if(userOffer.length>0){
            this.offerUser = userOffer[0].user;
            return true
        }
        return false;

      }
}