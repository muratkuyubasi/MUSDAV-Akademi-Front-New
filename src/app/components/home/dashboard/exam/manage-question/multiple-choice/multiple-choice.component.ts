import { Component, OnInit, Input } from '@angular/core';
import { ExamService } from '../../exam.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/base.component';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import  ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { ExamQuestionResource } from '@core/domain-classes/exam-resources';
import { HttpClient } from '@angular/common/http';
import { UploadAdapter } from '../../upload-adapter';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-question-multiple-choice',
    templateUrl: 'multiple-choice.component.html',
    styleUrls:['./multiple-choice.component.scss','../../../dashboard.component.scss','../../../edit-profile/edit-profile.component.scss'],
})

export class MultipleChoiceComponent extends BaseComponent implements OnInit {
    
    @Input() isSubQuestion:boolean;
    @Input() exam:any;
    @Input() question:any;
    @Input() questionCode:any;

    answers:any[]=[]

    questionResources:ExamQuestionResource;

    isEditMode:boolean=false
    questionForm:UntypedFormGroup

    editorConfig: AngularEditorConfig = {
      editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: '',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
          {class: 'arial', name: 'Arial'},
          {class: 'times-new-roman', name: 'Times New Roman'},
          {class: 'calibri', name: 'Calibri'},
          {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
        {
          name:'imageSize',
          class:"imageSize",
          tag:'img'
        }
      ],
      //  uploadUrl: 'exam/FileUpload',
      //  upload:(file:File)=>{
        
      //   return null;
      //  },
      //  uploadWithCredentials: false,
      //  sanitize: true,
      // toolbarPosition: 'top',
      // toolbarHiddenButtons: [
      //   ['bold', 'italic'],
      //   ['fontSize']
      // ]
    };

    // public Editor = ClassicEditor;
    // public config = {
    //   toolbar: [ 'heading', '|',
    //     'FontFamily ','Fontsize',
    //     'Alignment',
    //     'fontColor','fontBackgroundColor', '|',
    //     'Bold', 'italic', 'custombutton', 'strikethrough','underline','subscript','superscript','|',
    //     'link','|',
    //     'outdent','indent','|',
    //     'bulletedList','numberedList','|',
    //     'code','codeBlock','|',
    //     'insertTable','|',
    //     //  'imageUpload',
    //     'blockQuote','|',
    //     'undo','redo','|',
    //     'youtube',
    //     // 'mediaEmbed',
    //     'source'
    //   ]
    // }


    questionTypes=[{
        id:1,
        title:"Çoktan Seçmeli"
    }];

    constructor(
        private examService:ExamService,
        private activeRoute:ActivatedRoute,
        private translate:TranslateService,
        private fb: UntypedFormBuilder,
        private toastrService:ToastrService,
        private translationService: TranslationService,
        private http:HttpClient
    ) {
        super();
        this.questionResources = new ExamQuestionResource();
        this.questionResources.skip=0;
        this.questionResources.pageSize = 1;
        this.questionResources.orderBy = "Id Desc"  
        
        this.createQuestionForm()
     }

    ngOnInit() {
      if(this.questionCode){
        this.questionResources.questionCode = this.questionCode;
        this.examService.getExamQuestions(this.questionResources).subscribe((resp:any)=>{

          this.question = resp.body[0];
          console.log(this.question)
          this.questionForm.patchValue(resp.body[0])    
          this.questionForm.get('questionAnswers').patchValue(resp.body[0].questionAnswers)     
          this.isEditMode = true;
          console.log(this.questionForm.get('questionAnswers').value)
          // if(this.question?.questionAnswers.length>0){
          //   this.answers.push(this.question.questionAnswers)
            
          //   console.log(this.answers)
          // }
          // console.log(this.question)
          
      })
          
      
      }
      this.allRecord()
      // this.allAnswerRecord()
     
     }

    createQuestionForm(){
        this.questionForm = this.fb.group({
            id:[''],
            code:[''],
            examId:[this.exam?.id],
            questionId:[''],
            questionTypeId:[1],
            questionDuration:[0],
            questionScore:[0],
            multipleQuestion:this.isSubQuestion,
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
            let questionRecords= this.fb.group({
                id: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].id:0],
                languageCode:[this.question?.questionRecords[i] ? this.question?.questionRecords[i].languageCode: record],
                examQuestionId:[this.question? this.question?.id: 0],
                questionText: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].questionText: ''],
                attachedImage: [this.question?.questionRecords[i] ? this.question?.questionRecords[i].attachedImage: ''],
            })
            this.questionRecords.push(questionRecords);
            i++;
        }
    }

    allAnswerRecord(){
      console.log(this.answers);
        for (let i=0; i< this.question?.questionAnswers.length; i++){
            let answerRecords= this.fb.group({
                id: [this.question?.questionAnswers[i] ? this.question?.questionAnswers[i].id:0],
                // languageCode:[this.question?.questionRecords[i] ? this.question?.questionRecords[i].languageCode: record],
                examQuestionId:[this.question?.questionAnswers[i] ? this.question?.questionAnswers[i].examQuestionId:0],
                isCorrect:[this.question?.questionAnswers[i] ? this.question?.questionAnswers[i].isCorrect:false],
                answerRecords:this.getAnswerRecords(this.question?.questionAnswers[i])
                
            })
              this.questionAnswers.push(answerRecords);
        }
    }

    getAnswerRecords(answer){
      console.log(answer);
        this.fb.group({
         id:answer.id,
         isCorrect:answer.isCorrect,
         answerRecords:this.getAnswerRecordDatas(answer.answerRecords)
       })
    }

    getAnswerRecordDatas(data){
      let record = this.fb.group({});
      for(let i =0; i< data.length;i++){
        record.patchValue(data[i])
        // record =this.fb.group({
        //   id:data[i].id,
        //   answerId:data[i].answerId,
        //   answerText:data[i].answerText
        // })
      }
      return record
    }
    

     saveQuestion(){
        if(this.questionForm.valid){
            const question = this.createQuestionObject()
            console.log(question);
            if (this.isEditMode) {
                this.sub$.sink = this.examService.updateQuestion(question).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
      
                });
              } else {
                this.sub$.sink = this.examService.addQuestion(question).subscribe((resp) => {
      
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                //   this.router.navigate(['/dashboard/exams']);
                  // // this.router.navigate(['/admin/opened-courses/manage-opened-course/'+resp?.code]);
      
                });
              }
        }
        else{
            this.questionForm.markAllAsTouched()
        }
     }

     createQuestionObject(){
        let examId = this.exam !=undefined ? this.exam.id : this.question.examId;

        const question = {
            id:this.question ? this.question.id:0,
            code:this.question ? this.question.code:0,
            examId:examId,
            questionTypeId :  this.questionForm.get("questionTypeId").value,
            questionDuration:this.isSubQuestion ? 0 :this.questionForm.get("questionDuration").value,
            questionScore:this.isSubQuestion ? 0 :this.questionForm.get("questionScore").value,
            multipleQuestion:this.isSubQuestion,
            questionRecords: (this.questionRecords.value as any[]).filter(c => c.questionText),
            questionAnswers: (this.questionAnswers.value as any[])
        }
        return question;
     }

     setQuestion(e){
            this.isSubQuestion=e.checked
     }

     get questionAnswers(): UntypedFormArray {
      return this.questionForm.get("questionAnswers") as UntypedFormArray
    }


     newAnswer(){
      let answers = this.fb.group({
        id:[0],
        examQuestionId:[this.question ? this.question.id:0],
        answerScore:[0],
        isCorrect:[false],
        answerRecords:this.fb.array([])
      })
      this.addNewAnswerRecord(answers.get('answerRecords'))
      return answers;
     
    }
     addAnswer(){
      this.questionAnswers.push(this.newAnswer())
      
      
     }

     removeAnswer(i: number) {
      this.questionAnswers.removeAt(i);
    }

    addNewAnswerRecord(control){
      let i =0;
      for (let record of this.translate.getLangs()){
        control.push(
          this.fb.group({
            languageCode:[record],
            answerText:['',Validators.required]
          })
        )
      }
      
    }

    // get answerRecords(): UntypedFormArray {
    //   return this.questionAnswers.get("answerRecords") as UntypedFormArray
    // }

    // allAnswerRecords(){
    //   let i =0;
    //   for (let record of this.translate.getLangs()){
      
    //      let answerRecord= this.fb.group({
    //        id: [''],
    //        answerId: [''],
    //        languageCode:[record],
    //        answerText:['',Validators.required]
    //      })

    //      this.answerRecords.push(answerRecord)
    //     //  console.log(this.answerRecords?.controls)
    //     //  this.questionAnswers.setValue([
    //     //   {
    //     //     id:[i],
    //     //     answerRecords:[this.answerRecords]
    //     //   }
    //     //  ])
    //     //  .push(answerRecord)
    //      i++;
    //   }
    // }

     onReady(event){


      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }

      }
  }

  showOption(){
    this.allAnswerRecord()
  }
  setCorrect(ri){
    for(let i=0; i<this.questionAnswers.controls.length; i++){
      if(ri==i){
        this.questionAnswers.controls[i].get('isCorrect').patchValue(true)
      }
      else{
        this.questionAnswers.controls[i].get('isCorrect').patchValue(false)
      }
    }
  }
}