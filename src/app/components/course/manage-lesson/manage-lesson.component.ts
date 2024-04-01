import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CourseService } from '../course.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { Editor } from 'ngx-editor';
import {MatAccordion} from '@angular/material/expansion';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { BaseComponent } from 'src/app/base.component';
import { environment } from '@environments/environment';
import { VimeoUploadService } from '../vimeo-upload-service';


@Component({
    selector: 'app-manage-lesson',
    templateUrl: 'manage-lesson.component.html'
})

export class ManageLessonComponent extends BaseComponent implements OnInit {
    
    sectionId:any;
    lessonId:any;
    isSectionEditMode:boolean=true;
    section:any;
    lessonForm:UntypedFormGroup;
    showAddLesson:boolean=false;
    isLessonEditMode = false;
    lesson:any;
    sectionEditor: Editor;
    sectionForm:UntypedFormGroup;

    fileSelected: File;

    constructor(
        private route:ActivatedRoute,
        private fb: UntypedFormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private courseService: CourseService,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService,
        private commonDialogService: CommonDialogService,
        private uploadControl: VimeoUploadService,
    ) {
        super()
       this. sectionId = this.route.snapshot.params.sectionId
       this.lessonId =  this.route.snapshot.params.lessonId
     }

    ngOnInit() { 
        if(this.sectionId != undefined){
            this.getSection()
        }
        
        this.createSectionForm();
        this.createLessonForm();
        
        this.sectionEditor = new Editor();
    }

    getSection(){
        this.courseService.getSection(this.sectionId).subscribe((resp:any)=>{
            this.section = resp
            this.sectionForm.patchValue(this.section);
        })
    }

        //#region SECTION

         
        createSectionForm(){
            this.sectionForm = this.fb.group({
                id:[],
                courseId:[this.section?.courseId],
                title:['',Validators.required],
                description:[''],
                code:[this.section?.code],
            })
         }

         saveSection(){
            if (this.sectionForm.valid) {
                const section = this.createSectionObject();
                if (this.isSectionEditMode) {
                  this.sub$.sink = this.courseService.updateSection(section).subscribe(() => {
                    this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                    // this.router.navigate(['/admin/users']);
                  });
                } else {
                  this.sub$.sink = this.courseService.addSection(section).subscribe((resp) => {
                    this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                    // this.router.navigate(['/admin/users']);
                  });
                }
              } else {
                this.sectionForm.markAllAsTouched();
              }
         }
    
         createSectionObject(){
            const courseId = this.section?.courseId;
            const section = {
                id:this.sectionForm.get('id').value,
                courseId:courseId,
                title:this.sectionForm.get('title').value,
                description:this.sectionForm.get('description').value,
                code:this.section?.code
            }
            return section;
         }
    
         deleteSection(section: any,index) {
            const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
            this.sub$.sink = this.commonDialogService
              .deleteConformationDialog(`${areU}:: ${section.title}`)
              .subscribe((flag: boolean) => {
                if (flag) {
                  this.sub$.sink = this.courseService.deleteSection(section)
                    .subscribe(() => {
                      this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                    //   this.getEmailTemplates();
                    });
                }
              });
          }
    //#endregion
         

    //#region LESSON
        lessonDetail(lesson){
            this.showAddLesson = true;
            this.isLessonEditMode = true;
            this.lessonForm.patchValue(lesson);
            this.lesson = lesson
          }
      
          addLesson(sectionId){
            this.isLessonEditMode = false
            this.showAddLesson = true
            // this.lessonForm.reset()
            this.lessonForm.get('sectionId').patchValue(sectionId)
      
      
          }
      
          createLessonForm(){
            this.lessonForm = this.fb.group({
                id:[],
                sectionId:[this.section?.id],
                title:['',Validators.required],
                description:[''],
                videoPath:[''],
                videoUrl:[''],
                liveSessionUrl:[''],
                isPublish:[''],
                courseSectionId:[]
            })
         }
      
         createLessonObject(){
          const sectionId = this.section?.id;
          const lesson = {
              id:this.lessonForm.get('id').value,
              sectionId:sectionId,
              title:this.lessonForm.get('title').value,
              description:this.lessonForm.get('description').value,
              videoUrl:this.lessonForm.get("videoUrl").value,
              videoPath:this.lessonForm.get("videoPath").value,
              courseSectionId:sectionId
          }
          return lesson;
        }
      
      
      
        saveLesson(){
          if (this.lessonForm.valid) {
            const lesson = this.createLessonObject();
            if (this.isLessonEditMode) {
              this.sub$.sink = this.courseService.updateLesson(lesson).subscribe(() => {
                this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                // this.router.navigate(['/admin/users']);
              });
            } else {
              this.sub$.sink = this.courseService.addLesson(lesson).subscribe((resp) => {
                this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                // this.router.navigate(['/admin/users']);
                this.section?.lessons?.push(resp);
              });
            }
          } else {
            this.sectionForm.markAllAsTouched();
          }
        }
      
        setVideoUrl(value) {
            this.lessonForm.get("videoUrl").patchValue(value.url);
            this.lessonForm.get("videoPath").patchValue(value.path);
           
        }

        deleteLesson(lesson,index){
            
            const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
            this.sub$.sink = this.commonDialogService
            .deleteConformationDialog(`${areU}:: ${lesson.title}`)
            .subscribe((flag: boolean) => {
                if (flag) {
                this.sub$.sink = this.courseService.deleteLesson(lesson)
                    .subscribe(() => {
                    this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                    this.section?.lessons?.splice(index,1);
                    this.removeVimeo(lesson)
                    //   this.getEmailTemplates();
                    });
                }
            });
        }
          //#endregion


    //#region FILE
    onFileSelected(event){
        const file:File = event.target.files[0];

        if (file) {

            const fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);

            const upload$ = this.courseService.addFile(formData)


            //  const upload$ = this.http.post("/api/thumbnail-upload", formData);

            upload$.subscribe();
        }
    }

    fileEvent($event,id) {


        this.fileSelected = $event.target.files[0];
        if (!this.fileSelected) {
          return;
        }
        const mimeType = this.fileSelected.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(this.fileSelected);
        // tslint:disable-next-line: variable-name
        reader.onload = (_event) => {
          const formData = new FormData();
          formData.append(this.fileSelected.name, this.fileSelected,id);
          
         
        }
    }
    //#endregion


          removeVimeo(lesson){
            const options = {
              token:environment.vimeoApiKey,
              url : 'nm/https://api.vimeo.com/me/videos/'+lesson.videoPath,
              videoName: "Angular",
            //   videoDescription: this.section.title
            };
        
        
            this.uploadControl.removeVimeo(options).subscribe(resp=>{
            })
          }
          
    
}