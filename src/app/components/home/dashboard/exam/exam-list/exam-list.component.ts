import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ExamService } from '../exam.service';
import { UserAuth } from '@core/domain-classes/user-auth';
import { ExamResource } from '@core/domain-classes/exam-resources';
import { SecurityService } from '@core/security/security.service';

@Component({
    selector: 'app-exam-list',
    templateUrl: 'exam-list.component.html',
    styleUrls:['./exam-list.component.scss']

})

export class ExamListComponent extends BaseComponent implements OnInit {

    appUserAuth:UserAuth = null;


    exams: any[]=[];

    examResource:ExamResource

    constructor(
        private examService:ExamService,
        private securityService:SecurityService
    ) {
        super()
        this.examResource = new ExamResource()
        this.examResource.pageSize = 20;
        // this.examResource.isActive = "0";
        this.examResource.languageCode = "tr";
        this.examResource.orderBy = 'Id desc'
        this.setTopLogAndName()
     }

    ngOnInit() { 
        this.getExams()
    }

    getExams(){
        this.examService.getUserExams(this.examResource).subscribe((resp:any)=>{
            console.log(resp.body)
            this.exams= resp.body
        })
    }

    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            this.examResource.userId = c.id
          }
        })
    }
}