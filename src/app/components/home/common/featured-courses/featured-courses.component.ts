import { Component,Input,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-featured-courses',
    templateUrl: './featured-courses.component.html',
    styleUrls: ['./featured-courses.component.scss']
})
export class FeaturedCoursesComponent extends BaseComponent implements OnInit {

    @Input() courses:any;
    @Input() courseType:any;
    constructor(
        public router: Router,
        private courseService:CourseService
    ) {
        super()
     }

     ngOnInit(): void {
        this.getCourses()
     }

     getCourses(){
        // this.courseService.getCourses()
     }
}