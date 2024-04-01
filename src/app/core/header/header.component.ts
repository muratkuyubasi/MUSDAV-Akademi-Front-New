import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';

interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
  }


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {

    @ViewChild('selectElem', { static: true }) el: ElementRef;
  @Input()
  public lead: any;
  navbarOpen = false;
  appUserAuth: UserAuth = null;
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang:'tr',
      name:'Türkçe',
      flag:'assets/img/tr-flag.jpg'
    },
    {
      lang: 'en',
      name: 'English',
      flag: 'assets/img/us-flag.jpg',
    },
  ];

    constructor(
    private router: Router,
    private securityService: SecurityService,
    private translationService: TranslationService) {
    super();
  }

    ngOnInit(): void {
        this.setTopLogAndName();
        this.setDefaultLanguage()
    }
    setDefaultLanguage() {
        const lang = this.translationService.getSelectedLanguage();
        if (lang)
          this.setLanguageWithRefresh(lang);
      }
    
      setLanguageWithRefresh(lang: string) {
        this.languages.forEach((language: LanguageFlag) => {
          if (language.lang === lang) {
            language.active = true;
            this.language = language;
          } else {
            language.active = false;
          }
        });
        this.translationService.setLanguage(lang);
      }
    
      setNewLanguageRefresh(lang: string) {
        this.sub$.sink = this.translationService.setLanguage(lang).subscribe((response) => {
          this.setLanguageWithRefresh(response['LANGUAGE']);
        });
      }
      setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c;
            if (this.appUserAuth.profilePhoto) {
              this.appUserAuth.profilePhoto = `${environment.apiUrl}${this.appUserAuth.profilePhoto}`
            }
          }
        })
      }

      onLogout(): void {
        this.securityService.logout();
        this.translationService.removeLanguage();
        this.router.navigate(['/']);
      }


    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

    classApplied3 = false;
    toggleClass3() {
        this.classApplied3 = !this.classApplied3;
    }

    classApplied4 = false;
    toggleClass4() {
        this.classApplied4 = !this.classApplied4;
    }

    classApplied5 = false;
    toggleClass5() {
        this.classApplied5 = !this.classApplied5;
    }

}