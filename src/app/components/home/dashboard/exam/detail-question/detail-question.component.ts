import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ExamQuestionResource } from '@core/domain-classes/exam-resources';
import { BaseComponent } from 'src/app/base.component';
import { ExamService } from '../exam.service';

@Component({
    selector: 'app-question-detail',
    templateUrl: 'detail-question.component.html',
    styleUrls:['../../dashboard.component.scss','../../edit-profile/edit-profile.component.scss'],
})

export class QuestionDetailComponent extends BaseComponent implements OnInit {
    
    questionResources:ExamQuestionResource
    questionCode:any;
    question:any;

    constructor(
        private activeRoute:ActivatedRoute,
        private examService:ExamService
    ) {
        super()
        this.activeRoute.params.subscribe(param=>{
            this.questionCode = param.code
        })
        this.questionResources = new ExamQuestionResource();
        this.questionResources.questionCode = this.questionCode;
     }

    ngOnInit() {
        // console.log(this.questionCode)
        this.examService.getExamQuestions(this.questionResources).subscribe((resp:any)=>{
            this.question = resp.body[0];
            // console.log(this.question)
        })
     }
}