import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';

@Component({
    selector: 'app-instructor-course-file',
    templateUrl: 'course-file.component.html'
})

export class InstructorCourseFileComponent extends BaseComponent implements OnInit {
    
    @Input() course:any;
    sections:any[]=[];
    files:any[]=[]
    
    constructor(
        private insService:InstructorService
    ) {
        super()
     }

    ngOnInit() {
        this.getCourseFiles()

     }

     getCourseFiles(){
        this.insService.getAllOpenedCourseFiles(this.course.id).subscribe(resp=>{
            
            resp.data.forEach(section => {
                section.lessons.forEach(lesson => {
                    lesson.files.forEach(file => {
                        this.files.push({
                            sectionName:section.sectionName,
                            lessonName:lesson.lessonName,
                            fileTitle:file.title,
                            fileType:file.fileType,
                            filePath:file.filePath,
                            id:file.id,
                            isPublish:file.isPublish
                        })
                    });
                });
            });
            
        })
     }
}