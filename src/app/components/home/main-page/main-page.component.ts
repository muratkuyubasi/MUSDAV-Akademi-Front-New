import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { CourseDataSource } from '../pages/courses-grid-page/course-datasource';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { CourseSection } from '../../course/course.model';
import { CourseService } from '../services/course.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-main-page',
    templateUrl: 'main-page.component.html'
})

export class MainPageComponent extends BaseComponent implements OnInit{

    dataSource: CourseDataSource;
    courseResource: HomePageCourseResource;
    courses: any[]=[];
    popularCourses:any[]=[];
    recommendedCourses:any[]=[];
    coursesHeaderData:any;

    tags=[
        {
            "name": "keywords",
            "content": "Eğitim, Uzaktan Eğitim, Çevrimiçi, Çevrimdışı, Yüzyüze, Özel Ders"
        },
        {
            "name": "description",
            "content": "Uzaktan Eğitim Akademisi, tüm alanlarda eğitim alma fırsatı sunan bir portaldır"
        },
        {
            "property":"og:title",
            "content":"Eğitim, Uzaktan Eğitim, Çevrimiçi, Çevrimdışı, Yüzyüze, Özel Ders"
        },
        {
            "property":"og:description",
            "content":"Uzaktan Eğitim Akademisi, tüm alanlarda eğitim alma fırsatı sunan bir portaldır"
        },
        { "property": 'og:site_name', "content": 'Eğitim Akademisi' }
        
    ] 


    constructor(
        private courseService: CourseService,
        private _title:Title,
        private _meta:Meta
    ) { 
        super()
        this.courseResource = new HomePageCourseResource();
        this.courseResource.pageSize = 40;
        this.courseResource.orderBy = 'Id desc'

        this._title.setTitle("Eğitim Akademisi | Çevrimiçi - Çevrimdışı - Yüzyüze")
        this._meta.addTags(this.tags)
    }

    ngOnInit() {
        this.dataSource = new CourseDataSource(this.courseService);
        this.dataSource.loadCourses(this.courseResource);
        this.dataSource.connect().subscribe(resp=>{
            this.courses = resp;
            this.popularCourses = resp.filter(item=>item.isPopuler);
            this.recommendedCourses = resp.filter(item=>item.isRecommend);
            console.log("Tüm Kurslar",resp)
            console.log("Popüler Kurslar",this.popularCourses)
            console.log("Önerilen Kurslar",this.recommendedCourses)
            
        })
    }   


}