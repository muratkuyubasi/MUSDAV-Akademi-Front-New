import { Component, OnInit } from '@angular/core';
import { ExamService } from '../exam.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/base.component';
import { ExamQuestionResource } from '@core/domain-classes/exam-resources';

@Component({
    selector: 'app-question-list',
    templateUrl: 'question-list.component.html',
    styleUrls:['../../dashboard.component.scss','../../edit-profile/edit-profile.component.scss']
})

export class QuestionListComponent extends BaseComponent implements OnInit {
    
    questionResources:ExamQuestionResource;
    exam:any;
    questions:any[]=[];
    constructor(
        private examService:ExamService,
        private activeRoute:ActivatedRoute,
        private translate:TranslateService,
    ) {
        super()
        this.questionResources = new ExamQuestionResource()
        this.questionResources.pageSize = 20;
     
        this.questionResources.languageCode = "tr";
        this.questionResources.orderBy = 'Id desc'
     }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { exam: any }) => {
              if (data.exam) {
                this.exam = data.exam.data
                this.questionResources.examId = this.exam?.id;
                console.log(this.exam)
                this.getExamQuestions()
              }
          });
     }

     getExamQuestions(){

        this.examService.getExamQuestions(this.questionResources).subscribe((resp:any)=>{
            console.log(resp.body)
            this.questions = resp.body
        })

     }
}