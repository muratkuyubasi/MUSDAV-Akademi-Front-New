import { Component, OnInit } from '@angular/core';
import { ExamService } from '../exam.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/base.component';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-manage-question',
    templateUrl: 'manage-question.component.html',
    styleUrls:['../../dashboard.component.scss','../../edit-profile/edit-profile.component.scss'],
})

export class ManageQuestionComponent extends BaseComponent implements OnInit {
    
    exam:any;
    questionForm:UntypedFormGroup
    isEditMode:boolean=false
    isSubQuestion:boolean = false;
    questionTypeId:number;

    public Editor = ClassicEditor;
    public config = {
      toolbar: [ 'heading', '|',
        'FontFamily ','Fontsize',
        'Alignment',
        'fontColor','fontBackgroundColor', '|',
        'Bold', 'italic', 'custombutton', 'strikethrough','underline','subscript','superscript','|',
        'link','|',
        'outdent','indent','|',
        'bulletedList','numberedList','|',
        'code','codeBlock','|',
        'insertTable','|',
        //  'imageUpload',
        'blockQuote','|',
        'undo','redo','|',
        'youtube',
        'mediaEmbed'
      ]
    }

    question:any;
    questionTypes=[{
        id:1,
        title:"Çoktan Seçmeli"
    }];

    constructor(
        private examService:ExamService,
        private activeRoute:ActivatedRoute,
        private translate:TranslateService,
        private fb: UntypedFormBuilder
    ) {
        super()
        this.createQuestionForm()
     }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { exam: any }) => {
              if (data.exam) {
                this.exam = data.exam.data
                console.log(this.exam)
              }
          });
          this.allRecord()
     }

     createQuestionForm(){
        this.questionForm = this.fb.group({
            id:[''],
            code:[''],
            examId:['',Validators.required],
            questionId:[''],
            questionTypeId:[''],
            questionDuration:[''],
            questionScore:[''],
            questionRecords:this.fb.array([]),
            questionAnswers:this.fb.array([])
        })
     }
    get questionRecords(): UntypedFormArray {
        return this.questionForm.get("questionRecords") as UntypedFormArray
    }

    allRecord() {
        let i = 0;
        for (let record of this.translate.getLangs()){
            let newRecord= this.fb.group({
                id: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].id:0],
                languageCode:[this.question?.questionRecords[i] ? this.question?.questionRecords[i].languageCode: record],
                examQuestionId:[this.question? this.question?.id: 0],
                questionText: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].questionText: ''],
                attachedImage: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].attachedImage: ''],
            })
            this.questionRecords.push(newRecord);
            i++;
        }
     }

     saveQuestion(){
        console.log(this.questionForm.value)
     }

     setQuestion(e){
            this.isSubQuestion=e.checked
        console.log(this.isSubQuestion)
     }

     setQuestionType(e){
        this.questionTypeId = e.target.value
     }
}