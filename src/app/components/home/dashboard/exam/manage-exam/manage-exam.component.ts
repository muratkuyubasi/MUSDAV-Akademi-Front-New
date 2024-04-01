import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/base.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadAdapter } from '../upload-adapter';
import { HttpClient } from '@angular/common/http';
import { ExamService } from '../exam.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import * as moment from 'moment';

@Component({
    selector: 'app-manage-exam',
    templateUrl: 'manage-exam.component.html',
    styleUrls:['../../dashboard.component.scss','../../edit-profile/edit-profile.component.scss'],

})

export class ManageExamComponent extends BaseComponent implements OnInit {
    exam:any;
    examForm:UntypedFormGroup
    isEditMode:boolean=false
    courses:any[]=[]

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

    constructor(
        private activeRoute:ActivatedRoute,
        private fb:UntypedFormBuilder,
        private translate:TranslateService,
        private http:HttpClient,
        private examService:ExamService,
        private toastrService:ToastrService,
        private translationService:TranslationService,
        private router:Router
    ) {
        super()
        this.getUserCourse()
        this.createExamForm()
     }

    ngOnInit() {
      
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { exam: any }) => {
              if (data.exam) {
                console.log(data)

                this.exam = data.exam.data;

                let startTime = moment(this.exam.startDateTime).add(3,'hours')
                if(this.exam.dueDateTime){
                  let dueTime = moment(this.exam.dueDateTime).add(3,'hours')
                  this.exam.dueDateTime = dueTime.toISOString().substring(0, 16)
                }

                this.isEditMode=true
                this.exam.startDateTime = startTime.toISOString().substring(0, 16)
                this.examForm.patchValue(this.exam)
              }
          });

          this.allRecord()
     }

     getUserCourse(){
      this.examService.getUserCourses().subscribe((resp:any)=>{
        this.courses = resp.data;
        // console.log(resp.data)
      })
     }

     allRecord() {
        let i = 0;
        for (let record of this.translate.getLangs()){
            let newRecord= this.fb.group({
                id: [this.exam?.examRecords[i] ? this.exam?.examRecords[i].id:0],
                languageCode:[this.exam?.examRecords[i] ? this.exam?.examRecords[i].languageCode: record],
                examId:[this.exam? this.exam?.id: 0],
                title: [this.exam?.examRecords[i] ? this.exam?.examRecords[i].title: ''],
                description: [this.exam?.examRecords[i] ? this.exam?.examRecords[i].description: ''],
            })
            this.examRecords.push(newRecord);
            i++;
        }
     }

     createExamForm(){
        this.examForm = this.fb.group({
            id:[''],
            code:[''],
            openedCourseId:['',Validators.required],
            startDateTime: new FormControl(new Date().toISOString()),
            dueDateTime:[''],
            randomizeQuestion:[''],
            scheduleQuestion:['',Validators.required],
            isActive:[''],
            examRecords:this.fb.array([])
        })
        
     }

     get examRecords(): UntypedFormArray {
        return this.examForm.get("examRecords") as UntypedFormArray
    }


    onReady($event){
        $event.plugins.get('FileRepository').createUploadAdapter = (loader)=> {
          return new UploadAdapter(loader,'',this.http);
        };
    }

    saveExam(){
      if(this.examForm.valid){
        const exam = this.createExamObject()
        if (this.isEditMode) {
          this.sub$.sink = this.examService.updateExam(exam).subscribe(() => {
            this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));

          });
        } else {
          this.sub$.sink = this.examService.addExam(exam).subscribe((resp) => {

            this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
            this.router.navigate(['/dashboard/exams']);
            // // this.router.navigate(['/admin/opened-courses/manage-opened-course/'+resp?.code]);

          });
        }
      }
      else{
        this.examForm.markAllAsTouched()
      }
    }

    createExamObject(){
      const id = this.exam?.id;
      const code = this.exam?.code;
      const exam = {
        id:id,
        code:code,
        openedCourseId:this.examForm.get('openedCourseId').value,
        randomizeQuestion:this.examForm.get('randomizeQuestion').value,
        scheduleQuestion:this.examForm.get('scheduleQuestion').value,
        dueDateTime:this.examForm.get('dueDateTime').value,
        startDateTime:this.examForm.get('startDateTime').value,
        isActive:this.examForm.get('isActive').value,
        examRecords: (this.examRecords.value as any[]).filter(c => c.title)
      }
      return exam;
    }

}