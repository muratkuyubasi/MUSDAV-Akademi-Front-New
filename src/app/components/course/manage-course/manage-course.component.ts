import { Component, OnInit,ViewChild,Input } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { Course } from '../course.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { Editor } from 'ngx-editor';
import {MatAccordion} from '@angular/material/expansion';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';

@Component({
    selector: 'app-manage-course',
    templateUrl: 'manage-course.component.html',
    styleUrls:['./manage-course.component.scss']
})

export class ManageCourseComponent extends BaseComponent implements OnInit {

  @Input() VideoURL?:any;

    @ViewChild(MatAccordion) accordion: MatAccordion;
    course: Course;
    courseForm: UntypedFormGroup;
    sectionForm:UntypedFormGroup;
    studentForm:UntypedFormGroup;
    lessonForm:UntypedFormGroup;

    isEditMode = false;
    isSectionEditMode = false;
    isLessonEditMode = false;
    lesson:any;
    editor: Editor;
    sectionEditor: Editor;
    categories:any[]=[];
    teachers:any;
    panelOpenState = false;
    showAddSection:boolean=false;
    showAddLesson:boolean=false;
    showAddStudent:boolean=false;

    constructor(
        private fb: UntypedFormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private courseService: CourseService,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService,
        private commonDialogService: CommonDialogService,
    ) {
        super()
        this.getTeachers()
        this.getCategories();
     }

    ngOnInit() {
        
        this.editor = new Editor();
        this.sectionEditor = new Editor();
        this.createCourseForm();
        this.createSectionForm();
        this.createLessonForm();
        
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { course: Course }) => {
              if (data.course) {
                this.isEditMode = true;
                this.courseForm.patchValue(data.course);
                this.courseForm.get('categoryId').patchValue(data.course.categoryId)
                this.course = data.course;
              } 
          });
     }

     getTeachers(){
        this.courseService.getTeachers("CA8C2198-C488-43C3-B573-73E0E313C2F4").subscribe((resp:any)=>{
            this.teachers = resp;
        })
     }

     getCategories(){
        this.courseService.getCategories().subscribe((resp:any)=>{
            this.categories = resp
      
        })
     }

     //#region  COURSE
     createCourseForm(){
        this.courseForm = this.fb.group({
            id: [''],
            code:[''],
            categoryId:['',Validators.required],
            teacherId:['',Validators.required],
            title:['',Validators.required],
            shortDescription:['',Validators.required],
            description:['',Validators.required],
            coursePrice:[0],
            courseQuota:[0],
            isPopuler:[false],
            isRecommend:[false],
            isPublish:[false]

        })
     }

     saveCourse(){
        if (this.courseForm.valid) {
            const course = this.createCourseObject();
            if (this.isEditMode) {
                this.sub$.sink = this.courseService.updateCourse(course).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                  // this.router.navigate(['/admin/users']);
                });
              } else {
                this.sub$.sink = this.courseService.addCourse(course).subscribe((resp) => {
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/course/manage/'+resp?.code]);
                });
              }
        } else {
            this.courseForm.markAllAsTouched();
          }
     }

     createCourseObject(){
        const id = this.course?.id;
        const code = this.course?.code;
        const course = {
            id:id,
            code:code,
            title:this.courseForm.get('title').value,
            description:this.courseForm.get('description').value,
            shortDescription:this.courseForm.get('shortDescription').value,
            categoryId:this.courseForm.get('categoryId').value,
            teacherId:this.courseForm.get('teacherId').value,
            coursePrice:this.courseForm.get('coursePrice').value,
            courseQuota:this.courseForm.get('courseQuota').value,
            isPopuler:this.courseForm.get('isPopuler').value,
            isRecommend:this.courseForm.get('isRecommend').value,
            isPublish:this.courseForm.get('isPublish').value
        }
        return course;
     }


     //#endregion

     

     
    //#region SECTION
    sectionDetail(section){
        this.showAddSection = true;
        this.isSectionEditMode = true;
        this.sectionForm.patchValue(section);
    }
     
    createSectionForm(){
        this.sectionForm = this.fb.group({
            id:[],
            courseId:[this.course?.id],
            title:['',Validators.required],
            description:['']
        })
     }

     addSection(){
        this.isSectionEditMode = false
        this.showAddSection = true
        this.sectionForm.reset()
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
                this.course?.courseSections?.push(section);
                // this.router.navigate(['/admin/users']);
              });
            }
          } else {
            this.sectionForm.markAllAsTouched();
          }
     }

     createSectionObject(){
        const courseId = this.course?.id;
        const courseCode = this.course?.code;
        const section = {
            id:this.sectionForm.get('id').value,
            courseId:courseId,
            title:this.sectionForm.get('title').value,
            description:this.sectionForm.get('description').value,
            // code:courseCode
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
                  this.course?.courseSections?.splice(index,1);
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
          sectionId:[this.course?.id],
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
    const sectionId = this.course?.id;
    const courseCode = this.course?.code;
    const lesson = {
        id:this.lessonForm.get('id').value,
        sectionId:sectionId,
        title:this.lessonForm.get('title').value,
        description:this.lessonForm.get('description').value,
        videoUrl:this.lessonForm.get("videoUrl").value,
        videoPath:this.lessonForm.get("videoPath").value,
        courseSectionId:sectionId
        // code:courseCode
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
          this.course?.courseSections?.push(lesson);
          // this.router.navigate(['/admin/users']);
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
    //#endregion
    
    addStudent(){

     }

     
}