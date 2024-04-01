import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { OpenedCoursesService } from '../../opened-courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-lesson-list',
    templateUrl: 'lesson-list.component.html'
})

export class LessonListComponent extends BaseComponent implements OnInit {
    isEditMode:boolean = false;
    sectionCode:any;
    section:any;
    course:any;
    constructor(
        private courseService:OpenedCoursesService,
        private route:ActivatedRoute
    ) {
        super()
        this.route.params.subscribe(param=>{
            this.sectionCode = param.sectionCode
            
        })
     }

    ngOnInit() {
        this.getSection()
     }

     getSection(){
            this.courseService.getOpenedCourseSection(this.sectionCode).subscribe((resp:any)=>{
                console.log(resp)
                this.section = resp;
                this.course = resp.openedCourse
                console.log("kurs",this.course)
                this.getLessons()
            })
     }

     getLessons(){
        this.courseService.getOpenedCourseLessons(this.section.id).subscribe(resp=>{
            console.log("Dersler",resp)
        })
     }
}