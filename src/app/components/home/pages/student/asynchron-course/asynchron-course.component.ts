import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';
import { CourseService } from '../../../services/course.service';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-student-asynchron',
    templateUrl: 'asynchron-course.component.html',
    styleUrls:['../student-course-detail/student-course-detail-page.component.scss']

})

export class StudentASynchronCourseComponent extends BaseComponent implements OnInit {
    @Input() course:any;


    appUserAuth:UserAuth=null;
    courseRecord:any;
    isUserCourse:boolean = false;

    @ViewChild(PlyrComponent, { static: true })
    plyr: PlyrComponent;
  
    // or get it from plyrInit event
    player: Plyr;

    videoSrc:string="";
  
    vimeoVideoSource: Plyr.Source[] = [];

    vimeoSources:any;

    vimeoLink: any;
    videoLastSeekTime:number;
    lastLesson:any;
    lastSection:any;
    playVideo:boolean=false;

    questionForm:UntypedFormGroup
    noteForm:UntypedFormGroup
    showNoteForm:boolean=false;
    videoLastSeekSecondTime:any;
    files:any[]=[]

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
        private fb:UntypedFormBuilder
    ) {
        super()
     }

    ngOnInit() {
        this.setTopLogAndName()
                
        this.createQuestionForm()
        this.createNoteForm();
        this.checkUserCourse();
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
        this.videoLastSeekTime  = this.course.lastLessonAttendance.lastSeekTime;

        this.getCourseFiles()
        
        // let lastSection = this.course.openedCourseSections.filter(item=>item.id == this.course.lastSection)[0];

        // if(lastSection != undefined){
        //     this.lastSection = lastSection;
        //     this.lastLesson = lastSection.sectionLessons.filter(item=>item.id == this.course.lastLesson)[0];
        //     // this.lastLesson = lastLesson;

        // }
        // else{
        //     this.lastSection = this.course.openedCourseSections[0];
        //     this.lastLesson = this.lastSection.sectionLessons[0];
        // }
       
        this.vimeoSources = [
            {
            src: this.lastLesson.videoUrl,
            provider: 'vimeo',
            
            },
        ];
    }

    setLesson(lesson){
        this.player.currentTime = lesson.lastSeekTime
        this.lastLesson = lesson;
        this.vimeoSources = [
            {
            src: lesson.videoUrl,
            provider: 'vimeo',
            },
        ];
    }

    played(event: Plyr.PlyrEvent) {
        this.playVideo = true;
        if(this.playVideo){
            this.player.currentTime = this.videoLastSeekTime

        }
      
      }

    playerTime(e){
        if(this.playVideo){
            this.videoLastSeekTime = this.player.currentTime
        }
      
       

        this.videoLastSeekSecondTime = this.convertToSeek(this.videoLastSeekTime)
       
    }

    convertToSeek(time){    
        var date = new Date(null);
        date.setSeconds(time);
        return date.toISOString().substr(11, 8);
    }
    
    pause(){
        this.player.pause()
    }


    checkUserCourse(){
        this.courseService.checkUserCourse(this.appUserAuth.id,this.course.id).subscribe((resp)=>{
            this.userCourseCheck = resp
            if(resp.isRequiredPayment && !resp.isPayment){
                alert("Ödeme İşlemi Yapılmamış")
            }
            console.log(this.userCourseCheck)
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
            this.player.pause();    
        }
        else{
            this.showNoteForm = false
            this.player.play();
    
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
            lessonSeekTime:this.player.currentTime
           
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

     ngOnDestroy() {
        if(this.playVideo){
            let seek = Math.floor(this.videoLastSeekTime)
            const data={
                studentId:this.appUserAuth.id,
                openedCourseLessonId:this.lastLesson.id,
                duration:seek,
                id:this.course.lastLessonAttendance.id
            }
    
            if(this.course.lastLessonAttendance.id==0){
               this.courseService.addStudentAttendance(data).subscribe(resp=>{
                })
            }
            else{
    
                this.courseService.updateStudentAttendance(data).subscribe(resp=>{
                    })
            }
    
        }
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