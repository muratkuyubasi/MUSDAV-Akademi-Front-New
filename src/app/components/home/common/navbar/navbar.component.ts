import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';
import { UntypedFormGroup, UntypedFormBuilder} from '@angular/forms'
import { CourseDataSource } from '../../pages/courses-grid-page/course-datasource';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { CourseService } from '../../services/course.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@core/services/translation.service';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent implements OnInit {

    dataSource: CourseDataSource;
    courseResource: HomePageCourseResource;
    courses: any[]=[];

    appUserAuth:UserAuth = null
    searchForm:UntypedFormGroup

    searchKey = '';
    public keyword = 'courseName';
    
    public historyHeading: string = 'Recently selected';

    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    constructor(
        public router: Router,
        private securityService:SecurityService,
        private fb:UntypedFormBuilder,
        private courseService: CourseService,
        private translateService:TranslationService
    ) {
        super()
        this.setTopLogAndName()

        this.courseResource = new HomePageCourseResource();
        this.courseResource.pageSize = 40;
        this.courseResource.isConfirmed = "1";
        this.courseResource.orderBy = 'Id desc'

        this.searchForm = this.fb.group({
            name:[{value:'',disabled:false}]
        })

        this.historyHeading = this.translateService.getValue("HOMEPAGE.SEARCH_HISTORY")
        // .subscribe(resp=>{
        //     this.historyHeading = resp
        // })
     }

     ngOnInit() {
        this.dataSource = new CourseDataSource(this.courseService);
        this.dataSource.loadCourses(this.courseResource);
        this.dataSource.connect().subscribe(resp=>{
            this.courses = resp;
           
            
        })
     }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    searchClassApplied = false;
    toggleSearchClass() {
        this.searchClassApplied = !this.searchClassApplied;
    }

    sidebarClassApplied = false;
    toggleSidebarClass() {
        this.sidebarClassApplied = !this.sidebarClassApplied;
    }
    
    submitTemplateForm(value) {

        if(value !=''){
            this.router.navigate(['/search',value.searchKey])
        }

        // this.router.navigate(['/admin/users/permission', userId])
        
    }

    submitSearchForm(title) {

        this.router.navigate(['/search',title])
        //         if (this.searchForm.valid) {
        //   console.log(this.searchForm.value);
        // }
      }



    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
          }
        })
      }

      

}