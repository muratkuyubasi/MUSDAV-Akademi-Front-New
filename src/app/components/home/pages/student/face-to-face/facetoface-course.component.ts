import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CourseService } from '../../../services/course.service';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';


@Component({
    selector: 'app-student-facetoface',
    templateUrl: 'facetoface-course.component.html',
    styleUrls:['../student-course-detail/student-course-detail-page.component.scss']
})

export class StudentFaceToFaceCourseComponent extends BaseComponent implements OnInit {
    @Input() course:any;

    appUserAuth:UserAuth=null;
    courseRecord:any;
    isUserCourse:boolean = false;

    questionForm:UntypedFormGroup
    noteForm:UntypedFormGroup
    showNoteForm:boolean=false;
    videoLastSeekSecondTime:any;
    files:any[]=[]

    lastLesson:any;
    lastSection:any;

    userCourseCheck:any={
        isCourseRegister:false,
        isPayment:false,
        isRequiredPayment:false
    };


    constructor(
        private securityService:SecurityService,
        private activeRoute: ActivatedRoute,
        private courseService:CourseService,
        private vimeoService:VimeoUploadService,
        private fb:UntypedFormBuilder,
        private toastrService:ToastrService,
        private translationService:TranslationService
    ) {
        super()
     }

    ngOnInit() {
        this.setTopLogAndName()
                
        this.createQuestionForm()
        this.createNoteForm();
        this.checkUserCourse();
     }

     
    checkUserCourse(){
        this.courseService.checkUserCourse(this.appUserAuth.id,this.course.id).subscribe((resp)=>{
            this.userCourseCheck = resp
            if(resp.isRequiredPayment && !resp.isPayment){
                alert("Ödeme İşlemi Yapılmamış")
            }
        })
    }
    createQuestionForm(){
        this.questionForm = this.fb.group({
            studentId:[this.appUserAuth.id],
            question:['',Validators.required],
            isAnswered:[false],
            openedCourseLessonId:[this.lastLesson?.id]

        })
    }
    saveQuestion(){
        if(this.questionForm.valid){
            const question = this.questionFormObject()
            this.courseService.addStudentQuestion(question).subscribe((resp)=>{
                if(resp.success){
                    this.toastrService.success(this.translationService.getValue('HOMEPAGE.QUESTION_IS_SEND'));
                }
                else{
                    this.toastrService.error(this.translationService.getValue('HOMEPAGE.ERROR'));
                }
            })
        }
        else{
            this.questionForm.markAllAsTouched()
        }
    }
    questionFormObject(){
        const questionFormData = {
            studentId:this.appUserAuth.id,
            question:this.questionForm.get('question').value,
            isAnswered:false,
            openedCourseLessonId:this.lastLesson?.id
        }

        return questionFormData
    }


    setNoteForm(status){
        if(status){
            this.showNoteForm = true
        }
        else{
            this.showNoteForm = false    
        }
    }

    createNoteForm(){
        this.noteForm = this.fb.group({
            studentId:[this.appUserAuth.id],
            note:['',Validators.required],
            openedCourseLessonId:[this.lastLesson?.id],
            lessonSeekTime:[0]

        })
    }
    saveNote(){
        if(this.noteForm.valid){
            const note = this.noteFormObject()
            this.courseService.addStudentNote(note).subscribe((resp)=>{
            })
        }
        else{
            this.questionForm.markAllAsTouched()
        }
    }
    noteFormObject(){
        const noteFormData = {
            studentId:this.appUserAuth.id,
            note:this.noteForm.get('note').value,
            openedCourseLessonId:this.lastLesson?.id,
            lessonSeekTime:0
           
        }

        return noteFormData
    }

    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            this.setCourseData()
            // this.checkUserCourse()
          }
        })
    }

    getCourseFiles(){

            this.course.lessonFiles.forEach(section => {
                section.lessons.forEach(lesson => {
                    lesson.files.forEach(file => {
                        this.files.push({
                            sectionName:section.sectionName,
                            lessonName:lesson.lessonName,
                            fileTitle:file.title,
                            fileType:file.fileType,
                            filePath:file.filePath,
                            id:file.id,
                            isPublish:file.isPublish
                        })
                    });
                });
            });
           
     }

     setCourseData(){

        if(this.course.lastLessonAttendance.id !=0){
            this.lastSection = this.course.openedCourseSections.filter(item=>item.id == this.course.lastLessonAttendance.lastSectionId)[0]

            this.lastLesson = this.lastSection.sectionLessons.filter(item=>item.id == this.course.lastLessonAttendance.lastLessonId)[0];
        }
        else{
            this.lastSection =this.course.openedCourseSections[0];
            this.lastLesson = this.lastSection.sectionLessons[0];
        }

        this.getCourseFiles()
        
    }

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
   
        this.isOpen = false;
    }

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    // Accordion
    contentHeight: number = 0;
    openSectionIndex: number = -1;

    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
            this.calculateContentHeight();
        }
    }

    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }

    calculateContentHeight(): void {
        const contentElement = document.querySelector('.accordion-content');
        if (contentElement) {
            this.contentHeight = contentElement.scrollHeight;
        }
    }
}