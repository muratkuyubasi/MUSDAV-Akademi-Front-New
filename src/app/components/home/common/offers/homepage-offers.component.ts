import { Component,Input,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { BaseComponent } from 'src/app/base.component';
import { OfferResource } from '@core/domain-classes/offer-resources';
import { DashboardService } from '../../dashboard/dashboard.service';
import { OfferDataSource } from './offer-datasource';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ResponseHeader } from '@core/domain-classes/response-header';

@Component({
    selector: 'app-homepage-offers',
    templateUrl: './homepage-offers.component.html',
    styleUrls: ['./homepage-offers.component.scss','./table.scss']
})
export class HomePagesOfferComponent extends BaseComponent implements OnInit {

    currentTab = 'tab1';
    searchKey:any;
    searchKeyCtl: UntypedFormControl = new UntypedFormControl('');
    dataSource: OfferDataSource;
    offerResource:OfferResource;
    offersHeaderData:any;
    offers:any;


    pagination: number;
    
    constructor(
        public router: Router,
        private dashboardService:DashboardService

    ) {
        super()
        this.offerResource = new OfferResource();
        this.offerResource.skip = 0;
        this.offerResource.pageSize = 10;
        this.offerResource.orderBy = "Id Desc"
     }

     ngOnInit(): void {
        this.dataSource = new OfferDataSource(this.dashboardService);
         this.dataSource.loadOffers(this.offerResource);
        this.dataSource.responseHeaderSubject$.subscribe(resp=>{
          this.offersHeaderData = resp;
        })
    
        // this.dataSource.loading$.subscribe((resp)=>{
        // })
    
        this.dataSource.connect().subscribe(resp=>{
          this.offers = resp;
          this.getResourceParameter();
          this.filterLogic();
        })

        
     }

     filterLogic(){
        this.sub$.sink = this.searchKeyCtl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged()
          ).subscribe(c => {
            this.offerResource.title = c;
            this.offerResource.skip = 0;
            this.offers = this.dataSource.loadOffers(this.offerResource);
          });

     }

     renderPage(event: number) {
        this.pagination = event;
        this.offerResource.skip = event-1;

            this.offers = this.dataSource.loadOffers(this.offerResource);
           console.log(this.offers)

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
    


    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }
}