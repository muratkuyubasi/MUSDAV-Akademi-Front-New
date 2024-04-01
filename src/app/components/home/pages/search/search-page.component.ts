import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { SearchDataSource } from './search-datasource';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageCourseResource } from '@core/domain-classes/homepage-course-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';

@Component({
  selector: 'app-courses-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})

export class SearchPageComponent extends BaseComponent implements OnInit {
  dataSource: SearchDataSource;
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
  ){
    super()
    
    this.courseResource = new HomePageCourseResource();
    this.courseResource.pageSize = 20;
    this.courseResource.orderBy = 'Id desc'
    this.route.params.subscribe((param)=>{
      console.log(param)
      if(param.slug){
        this.courseResource.title = param.slug
        this.getSearchResult()
      }
    })
  }

  ngOnInit(){
    
  }

  getSearchResult(){
    this.dataSource = new SearchDataSource(this.courseService);
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
