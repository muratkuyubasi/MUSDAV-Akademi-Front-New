import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { BaseComponent } from 'src/app/base.component';
import { CourseDataSource } from './course-datasource';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';

@Component({
  selector: 'app-courses-grid-page',
  templateUrl: './courses-grid-page.component.html',
  styleUrls: ['./courses-grid-page.component.scss']
})

export class CoursesGridPageComponent extends BaseComponent implements OnInit {
  dataSource: CourseDataSource;
  courseResource: HomePageCourseResource;
  courses: any;
  coursesHeaderData:any;
  
  currentPage = 1;
  itemsPerPage = 20;
  maxSize = 5;

  constructor(
    private route:ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private _title:Title,
    private _meta:Meta
  ){
    super()
    
    this.courseResource = new HomePageCourseResource();
    this.courseResource.pageSize = 20;
    this.courseResource.orderBy = 'Id desc'
    this.route.params.subscribe((param)=>{
      this._title.setTitle("Eğitim Akademisi | Kurslar")
      if(param.slug){
        this.courseResource.categorySlug = param.slug
        this._title.setTitle("Eğitim Akademisi | "+param.slug)
      }
    })
  }

  ngOnInit(){
    this.dataSource = new CourseDataSource(this.courseService);
    this.dataSource.loadCourses(this.courseResource);
    this.dataSource.responseHeaderSubject$.subscribe(resp=>{
      this.coursesHeaderData = resp;
    })

    this.dataSource.loading$.subscribe((resp)=>{
      console.log(resp)
    })

    this.dataSource.connect().subscribe(resp=>{
      this.courses = resp;
      console.log(resp)
    })

    this.getResourceParameter();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.courseResource.pageSize = c.pageSize;
          this.courseResource.skip = c.skip;
          this.courseResource.totalCount = c.totalCount;
        }
      });
  }

}
