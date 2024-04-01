import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { OpenedCoursesService } from '../../opened-courses.service';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { environment } from '@environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
    selector: 'app-manage-asynchron',
    templateUrl: 'manage-asynchron.component.html'
})

export class ManageASynchronCourseDetailComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    @Input() section:any;
    
    isLessonEditMode = false;
    showAddLesson:boolean=false;
    lesson:any;
    lessons:any[]=[];
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
        private courseService: OpenedCoursesService,
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
      this.dataSource = new MatTableDataSource(this.section.openedCourseLessons)
      this.lessons = this.course.openedCourseLessons;

        this.allRecord();
        // this.getOpenedCourseLessons()

        console.log("SECTION",this.section)
        
    }

    getOpenedCourseLessons(){
      this.createLessonFileForm()
      this.lessons = this.section?.openedCourseLessons
      console.log(this.lessons)
      // this.courseService.getOpenedCourseLessons(this.section?.code).subscribe((resp:any)=>{
      //   this.lessons = resp
      // })
    }

    lessonDetail(lesson){
        this.showAddLesson = true;
        this.isLessonEditMode = true;
        this.lessonForm.patchValue(lesson);
        this.lesson = lesson

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
        const lesson = [{
                openedCourseSectionId: this.section.id,
                dateTime: week.format('DD-MM-YYYY'),
                day:week.format("dddd"),
                hour:week.format("HH:mm"),
                duration:0,
                classroom:'virtual',
                isFaceToFace:false,
                isSynchronous:false,
                isASynchronous:true,
                virtualClassUrl: "string",
                videoUrl: this.lessonForm.get("videoUrl").value,
                startLessonTime:week.format('YYYY-MM-DD HH:mm:ss'),
                openedCourseLessonRecords: (this.openedCourseLessonRecords.value as any[]).filter(c => c.title)

            }]
            return lesson;

        }


    saveLesson(){

        if (this.lessonForm.valid) {
          const lesson = this.createLessonObject();

      
          if (this.isLessonEditMode) {
            this.sub$.sink = this.courseService.updateOpenedCourseLesson(lesson).subscribe(() => {
              this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
             });
          } else {
            this.sub$.sink = this.courseService.addOpenedCourseLesson(lesson).subscribe((resp) => {
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

      deleteLesson(lesson,index){
          
          const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
          this.sub$.sink = this.commonDialogService
          .deleteConformationDialog(`${areU}:: ${lesson.openedCourseLessonRecords[0].title}`)
          .subscribe((flag: boolean) => {
              if (flag) {
              this.sub$.sink = this.courseService.deleteOpenedCourseLesson(lesson)
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
   
          this.courseService.AddLessonFile(formData).subscribe(resp=>{
            this.getOpenedCourseLessons()
          }) 
          // return formData;
         
       }

      onFileChange(event,lesson) {

        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          if (!file) {
            return;
          }
          const mimeType = file.type;
          if (mimeType.match(/image\/*/) == null) {
            return;
          }
          this.lessonFileForm.patchValue({
            fileSource: file,
            openedCourseLessonId:lesson.id,
            title:lesson.openedCourseLessonRecords[0].title,
            IsPublish:true,
          });


           this.createFormObject()
        }
      }

    

      removeVimeo(lesson){
        const options = {
          token:environment.vimeoApiKey,
          url : 'nm/https://api.vimeo.com/me/videos/'+lesson.videoPath,
          videoName: "Angular",
        //   videoDescription: this.section.title
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