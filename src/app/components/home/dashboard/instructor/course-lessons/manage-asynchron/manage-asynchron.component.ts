import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { environment } from '@environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { InstructorService } from '../../instructor.service';

@Component({
    selector: 'app-manage-ins-asynchron',
    templateUrl: 'manage-asynchron.component.html',
    styleUrls:['../course-lesson.scss']
})

export class ManageInsASynchronCourseDetailComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    @Input() section:any;
    @Input() lessons:any;
    
    isLessonEditMode = false;
    showAddLesson:boolean=false;
    lesson:any;
    // lessons:any[]=[];
    fileSelected: File;
    lessonForm: UntypedFormGroup;
    showButton:boolean = false
    lessonFile:any;
    lessonFileForm:UntypedFormGroup;

    displayedColumns: string[] = ['title', 'file','option'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        private route:ActivatedRoute,
        private fb: UntypedFormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private insService: InstructorService,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService,
        private commonDialogService: CommonDialogService,
        private uploadControl: VimeoUploadService,
        private translate:TranslateService,
    ) {
        super()
     }

    ngOnInit() { 

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      const forLang = this.course.openedCourseRecords.filter(item=>item.languageCode == this.defaultLang$)[0];
      this.course.openedCourseRecords = forLang;

      this.createLessonForm()
      this.createLessonFileForm()

      console.log("DERSLERRRR",this.lessons)

        this.allRecord();

        
    }


    getOpenedCourseLessons(){
      // this.createLessonFileForm()
      // this.lessons = this.section?.openedCourseLessons

    }

    lessonDetail(lesson){
      console.log("SEÇİLİ DERS",lesson)
        this.showAddLesson = true;
        
        this.isLessonEditMode = true;
        this.lessonForm.patchValue(lesson);
        this.lesson = lesson

        console.log(this.lessonForm.value)

      }

    createLessonForm(){
        let week= moment()
        this.lessonForm = this.fb.group({
            id:[0],
            openedCourseSectionId: [this.section.id],
            dateTime: week.format('DD-MM-YYYY'),
                day:week.format("dddd"),
                hour:week.format("HH:mm"),
                duration:0,
                classroom:'virtual',
                isFaceToFace:false,
                isSynchronous:false,
                isASynchronous:true,
                virtualClassUrl: "string",
                coursePicture:[],
            videoUrl:[''],
            openedCourseLessonRecords:this.fb.array([])
        })
     }

     get openedCourseLessonRecords(): UntypedFormArray {
        return this.lessonForm.get("openedCourseLessonRecords") as UntypedFormArray
    }

     createLessonObject(){
        let week= moment()
      
        const openedLessons = (this.openedCourseLessonRecords.value as any[]).filter(c => c.title);
        
        if(this.isLessonEditMode){
          const lesson = {
            id:this.lessonForm.get("id").value,
            openedCourseSectionId: this.section.id,
            dateTime: week.format('DD-MM-YYYY'),
            day:week.format("dddd"),
            hour:week.format("HH:mm"),
            duration:0,
            classroom:'virtual',
            isFaceToFace:false,
            isSynchronous:false,
            isASynchronous:true,
            virtualClassUrl: "",
            videoUrl: this.lessonForm.get("videoUrl").value,
            startLessonTime:week.format('YYYY-MM-DD HH:mm:ss'),
            openedCourseLessonRecords: (this.openedCourseLessonRecords.value as any[]).filter(c => c.title)

        }
        return lesson;
      }
        else{
          const lesson = [{
            id:0,
            openedCourseSectionId: this.section.id,
            dateTime: week.format('DD-MM-YYYY'),
            day:week.format("dddd"),
            hour:week.format("HH:mm"),
            duration:0,
            classroom:'virtual',
            isFaceToFace:false,
            isSynchronous:false,
            isASynchronous:true,
            virtualClassUrl: "",
            videoUrl: this.lessonForm.get("videoUrl").value,
            startLessonTime:week.format('YYYY-MM-DD HH:mm:ss'),
            openedCourseLessonRecords: (this.openedCourseLessonRecords.value as any[]).filter(c => c.title)

        }]
          return lesson;
          }
        }


    saveLesson(){

        if (this.lessonForm.valid) {
          const lesson = this.createLessonObject();

      
          if (this.isLessonEditMode) {
            this.sub$.sink = this.insService.updateOpenedCourseLesson(lesson).subscribe(() => {
              this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
             });
          } else {
            this.sub$.sink = this.insService.addOpenedCourseLesson(lesson).subscribe((resp) => {
              this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));


              // this.router.navigate(['/admin/users']);
            });
          }
        } else {
          this.lessonForm.markAllAsTouched();
        }
      }

      setVideoUrl(value) {
        if(value){
          this.showButton = true
        }
          this.lessonForm.get("videoUrl").patchValue(value.url);
        //   this.lessonForm.get("videoPath").patchValue(value.path);
         
      }

      deleteLesson(lesson){
          
          const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
          this.sub$.sink = this.commonDialogService
          .deleteConformationDialog(`${areU}:: ${lesson.openedCourseLessonRecords[0].title}`)
          .subscribe((flag: boolean) => {
              if (flag) {
              this.sub$.sink = this.insService.deleteOpenedCourseLesson(lesson.code)
                  .subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                  this.removeVimeo(lesson)
                  //   this.getEmailTemplates();
                  });
              }
          });
      }

      createLessonFileForm(){
        this.lessonFileForm = this.fb.group({
          id:[0],
          openedCourseLessonId: [''],
          title:[''],
          IsPublish:true,
          file: new FormControl(''),
          fileSource: new FormControl(''),
        })
      }

      createFormObject(){
          const formData = new FormData();
          formData.append('id', this.lessonFileForm.get('id').value);
          formData.append('title', this.lessonFileForm.get('title').value);
          formData.append('openedCourseLessonId', this.lessonFileForm.get('openedCourseLessonId').value);
          formData.append('IsPublish', this.lessonFileForm.get('IsPublish').value);

          formData.append('formFile', this.lessonFileForm.get('fileSource').value);
   
          this.insService.AddLessonFile(formData).subscribe(resp=>{
            // this.router.navigate(['/dashboard/course-lessons',this.section.code],{skipLocationChange: true });
            this.toastrService.success(this.translationService.getValue('HOMEPAGE.FILE_UPLOADED'));
            
           
          }) 
          // Navigate to /view
          // return formData;
         
       }




      onFileChange(event,lesson) {

        console.log(lesson)

        const file = event.target.files[0];

        if (!file) {
          return;
        }
        
        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null && 
            mimeType.match(/pdf\/*/) == null &&
            mimeType.match(/zip\/*/) == null ) {
          return this.toastrService.error(this.translationService.getValue('HOMEPAGE.INVALID_FILETYPE'));
        }

        this.lessonFileForm.controls['openedCourseLessonId'].patchValue(lesson.id);
        this.lessonFileForm.controls['title'].patchValue(lesson.openedCourseLessonRecords[0].title);
        this.lessonFileForm.controls['IsPublish'].patchValue(true);
        this.lessonFileForm.controls['fileSource'].patchValue(file);

        this.createFormObject();
          // console.log(this.lessonFileForm.value)

      }

      removeVimeo(lesson){
        const options = {
          token:environment.vimeoApiKey,
          url : 'nm/https://api.vimeo.com/me/videos/'+lesson.videoPath,
        };
    
        this.uploadControl.removeVimeo(options,1).subscribe(resp=>{
        })
      }

      allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].id:0],
                      openedCourseId:[this.lesson ? this.openedCourseLessonRecords[i]?.id: 0],
                      languageCode:[this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].languageCode: record],
                      title: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].title: ''],
                      description: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].description: '']
                    })
                    this.openedCourseLessonRecords.push(newRecord);
                  i++;
              }      
    }

    clearForm(){
      
      this.lessonForm.get("openedCourseLessonRecords") as UntypedFormArray
      this.isLessonEditMode = !this.isLessonEditMode
      this.lessonForm.reset(this.lessonForm.value)
      // this.lessonForm.get("openedCourseLessonRecords").patchValue("")
    }

}