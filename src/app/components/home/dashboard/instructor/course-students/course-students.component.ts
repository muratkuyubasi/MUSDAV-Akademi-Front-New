import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';

@Component({
    selector: 'app-instructor-course-students',
    templateUrl: 'course-students.component.html'
})

export class InstructorCourseStudentsComponent extends BaseComponent implements OnInit {
    
    @Input() course:any;
    students:any[]=[]
    constructor(
        private insService:InstructorService
    ) {
        super()
     }

    ngOnInit() {
        this.getStudents()
    }

    getStudents(){
        this.insService.getAllOpenedCourseStudents(this.course.id).subscribe((resp:any)=>{
            console.log("STUDENTS",resp.data)
            this.students = resp.data
        })
    }
}