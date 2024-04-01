import { Component, OnInit } from '@angular/core';

import { SecurityService } from '@core/security/security.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './base.component';

import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AppSettingService } from '@core/services/app-setting.service';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent extends BaseComponent implements OnInit {
    location: any;
    routerSubscription: any;

    constructor(private router: Router, private securityService: SecurityService,
        public translate: TranslateService,
        private translationService: TranslationService,
        private appSettingService:AppSettingService) {
            super();
            translate.setDefaultLang("tr");
            this.appSettingService.getAppSetting('2793af14-4f02-492b-a48d-179adef0e8ba').subscribe((resp:any)=>{
                    const lang = JSON.parse(resp.value)
                    let i=0;
                    for(let lng of lang.supportedLanguages){
                        translate.addLangs([lng.languageCode]);
                        i++;
                    }
                    translate.setDefaultLang(lang.defaultLanguage);
                    this.setLanguage();    
                
            },err=>{
                translate.addLangs(['tr','en']);
                translate.setDefaultLang('tr');
                this.setLanguage();
            })
    }

    setLanguage() {
        const currentLang = this.translationService.getSelectedLanguage();
        if (currentLang) {
          this.sub$.sink = this.translationService.setLanguage(currentLang)
          .subscribe(() => { });
        }
        else {
          const browserLang = this.translate.getBrowserLang();
          const lang = browserLang.match(/tr|en|de/) ? browserLang : 'tr';
          this.sub$.sink = this.translationService.setLanguage(lang).subscribe(() => { });
        }
    }
      
    ngOnInit(){
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
        .subscribe(event => {
            $.getScript('../assets/js/custom.js');
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}