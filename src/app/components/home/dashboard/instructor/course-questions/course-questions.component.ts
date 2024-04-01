import { Component, OnInit,Input } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';

@Component({
    selector: 'app-instructor-course-questions',
    templateUrl: 'course-questions.component.html'
})

export class InstructorCourseQuestionsComponent extends BaseComponent implements OnInit {

    @Input() course:any;
    questions:any[]=[]
    answer:any;

    constructor(
        private insService:InstructorService,
        private toastrService: ToastrService,
        private translationService:TranslationService

    ) {
        super()
     }

    ngOnInit() {
        this.getCourseQuestions()
    }

    getCourseQuestions(){
        this.insService.getAllOpenedCourseQuestions(this.course.id,this.defaultLang$).subscribe((resp)=>{
            console.log(resp.data)
            resp.data.forEach(section => {
                section.lessons.forEach(lesson => {
                    lesson.questions.forEach(question => {
                        this.questions.push({
                            id:question.id,
                            sectionName:section.sectionName,
                            lessonName:lesson.lessonName,
                            studentName:question.studentName,
                            question:question.question,
                            questionDate:question.questionDate,
                            answer:question.answer,
                            answerDate:question.answerDate,
                            isAnswered:question.isAnswered,
                            studentId:question.studentId
                        })
                    });
                });
            });
            // console.log(resp.data)
        })
    }

    sendAnswer(question){
        this.insService.updateStudentLessonQuestion(question).subscribe(resp=>{
            if(resp.success){
                this.toastrService.success(this.translationService.getValue('HOMEPAGE.ANSWER_IS_SEND'));
            }
            else{
                this.toastrService.error(this.translationService.getValue('HOMEPAGE.ERROR'));

            }
        })
    }
}