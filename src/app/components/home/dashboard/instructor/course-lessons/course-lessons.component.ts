import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';

@Component({
    selector: 'app-instructor-course-lessons',
    templateUrl: 'course-lessons.component.html'
})

export class InstructorCourseLessonsComponent extends BaseComponent implements OnInit {

    isEditMode:boolean = false;
    sectionCode:any;
    section:any;
    course:any;
    lessons:any[]=[]

    constructor(
        private insService:InstructorService,
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
        this.insService.getOpenedCourseSection(this.sectionCode).subscribe((resp:any)=>{
            console.log("COURSELESSONSSS",resp)
            this.section = resp;
            this.course = resp.openedCourse
            console.log("kurs",this.course)
            this.getLessons()
        })
 }

 getLessons(){
    this.insService.getOpenedCourseLessons(this.section.id).subscribe(resp=>{
        console.log("Dersler",resp)
        this.lessons = resp;

        console.log("Dersler",this.lessons)

        
    })
 }
}