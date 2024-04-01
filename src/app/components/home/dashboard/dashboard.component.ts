import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { BaseComponent } from 'src/app/base.component';
import { SecurityService } from '@core/security/security.service';
import { TranslationService } from '@core/services/translation.service';
import { UserAuth } from '@core/domain-classes/user-auth';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

    appUserAuth:UserAuth = null;
    userCounter:any;

    constructor(
        public router: Router,
        private dashboardService:DashboardService,
        private securityService:SecurityService,
        private translationService:TranslationService
    ) {
        super()
        this.setTopLogAndName()
     }

     ngOnInit(){
         this.getDashboardData()
     }

     getDashboardData(){
        this.dashboardService.getUserDashboardData().subscribe((resp:any)=>{
            this.userCounter = resp.data
        })
     }

     onLogout(): void {
        this.securityService.logout();
        this.translationService.removeLanguage();
        window.location.href = "/";
        this.router.navigate(['/']);
      }

      setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$
          .subscribe(c => {
            if (c) {
              this.appUserAuth = c;
             
            }
          })
      }

}