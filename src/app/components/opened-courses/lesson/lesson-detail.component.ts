import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { OpenedCoursesService } from '../opened-courses.service';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { CampusService } from '../../campus/campus.service';


@Component({
    selector: 'app-lesson-detail',
    templateUrl: 'lesson-detail.component.html'
})

export class LessonDetailComponent extends BaseComponent implements OnInit {
    
    lesson:any;
    lessonForm:UntypedFormGroup
    campuses:any[]=[];
    academicUnits:any[]=[];
    buildings:any[]=[];
    classrooms:any[]=[];
    classroom:any;
    selectClass:boolean=false

    constructor(
        private courseService:OpenedCoursesService,
        private campusService:CampusService,
        private fb:UntypedFormBuilder,
        private activeRoute:ActivatedRoute,
        public translate: TranslateService,
        private toastrService:ToastrService,
        private translationService:TranslationService
    ) {
        super()
     }

    ngOnInit() {
        
        this.createLessonForm()
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { lesson: any }) => {
              if (data.lesson) {
                this.lesson = data.lesson
                console.log("DErS",data.lesson)
                this.lessonForm.patchValue(data.lesson);
                let dateTime = moment(this.lesson?.startLessonTime)
                this.lessonForm.get('day').patchValue(this.lesson?.day)
                this.lessonForm.get('startLessonTime').patchValue(dateTime.toISOString().substring(0, 10))

                let day = this.lesson?.day.toUpperCase()
                this.translate.get(day).subscribe((resp)=>{
                    
                this.lessonForm.get('day').patchValue(resp)

                this.getClassroomDetail()

                })
              }
          });

          this.allRecord()
          this.getCampuses();
          
     }

     createLessonForm(){
        this.lessonForm = this.fb.group({
            id: [''],
            code:[''],
            openedCourseSectionId:[''],
            openedCourseBrancheId:[''],
            classroomId:[''],
            buildingId:[''],
            academicUnitId:[''],
            campusId:[''],
            day:[''],
            duration:[''],
            hour:[''],
            isASynchronous:[],
            isSynchronous:[],
            isFacetoFace:[],
            startLessonTime:[''],
            videoUrl:[''],
            virtualClassUrl:[''],
            openedCourseLessonRecords:this.fb.array([]),
            openedCourseLessonFiles:this.fb.array([])
        })
     }

     get openedCourseLessonRecords(): UntypedFormArray {
        return this.lessonForm.get("openedCourseLessonRecords") as UntypedFormArray
    }

    createLessonObject(){
        const id = this.lesson?.id;
        const code = this.lesson?.code;
        const openedCourseSectionId = this.lesson.openedCourseSectionId;
        const data = {
            id:id,
            code:code,
            openedCourseSectionId:openedCourseSectionId,
            classroomId:this.lessonForm.get('classroomId').value,
            openedCourseBrancheId:this.lessonForm.get('openedCourseBrancheId').value,
            day:moment(this.lessonForm.get('startLessonTime').value).format('dddd'),
            duration:this.lessonForm.get('duration').value,
            hour:this.lessonForm.get('hour').value,
            isASynchronous:this.lesson?.isASynchronous,
            isSynchronous:this.lesson?.isSynchronous,
            isFacetoFace:this.lesson?.isFacetoFace,
            startLessonTime:this.lessonForm.get('startLessonTime').value,
            videoUrl:this.lesson?.videoUrl,
            virtualClassUrl:this.lessonForm.get('virtualClassUrl').value,
            openedCourseLessonRecords: (this.openedCourseLessonRecords.value as any[]).filter(c => c.title)
            
        }

        return data;
        
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].id:0],
                      openedCourseSectionId:[this.lesson ? this.openedCourseLessonRecords[i]?.id: 0],
                      languageCode:[this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].languageCode: record],
                      title: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].title: ''],
                      description: [this.lesson?.openedCourseLessonRecords[i] ? this.lesson?.openedCourseLessonRecords[i].description: '']
                    })
                    this.openedCourseLessonRecords.push(newRecord);
                  i++;
              }      
    }

    editLesson(){
        if (this.lessonForm.valid) {
            const data = this.createLessonObject()
            this.sub$.sink = this.courseService.updateOpenedCourseLesson(data).subscribe((resp) => {
                        
                this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
              //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
              
              });
        }else {
            this.lessonForm.markAllAsTouched();
          }
        
    }

    getCampuses(){
        this.campusService.getCampuses().subscribe((resp:any)=>{
            this.campuses = resp.data;
        })
    }
    getAcademicUnits(e){
        this.campusService.getAcademicUnits(e.value).subscribe((resp:any)=>{
            this.academicUnits = resp.data
        })
    }
    getBuildings(e){
        this.campusService.getBuildings(e.value).subscribe((resp:any)=>{
            this.buildings = resp.data
        })
    }
    getClassrooms(e){
        this.campusService.getClassrooms(e.value).subscribe((resp:any)=>{
            this.classrooms = resp.data
        })
    }

    checkClassroom(e){
        
        this.classroom = this.classrooms.filter(item=>item.id==e.value)[0];
        
        // if(this.lesson.courseQuota > this.classroom.capacity){
        //     this.toastrService.error(this.translationService.getValue('Sınıf Kapasitesi Kurs Kontenjanından Düşük'));
        // }
    }

    getClassroomDetail(){
       
        if(this.lesson.classroomId != null && this.lesson.classroomId !=''){
          this.campusService.getClassroomById(this.lesson.classroomId).subscribe((resp)=>{
                this.classroom = resp.classroomRecords[0].name
                this.lessonForm.get('classroomId').patchValue(resp.id)

               
            })

        }
    }

    // getBuildingDetail(id){
    //     this.campusService.getBuildingById(id).subscribe((resp:any)=>{
    //         this.lessonForm.get('buildingId').patchValue(resp.id)
    //         this.getAcademicUnitDetail(resp.academicUnitId)
    //     })
    // }
    // getAcademicUnitDetail(id){
    //     this.campusService.getAcademicUnitById(id).subscribe((resp:any)=>{
    //         this.lessonForm.get('academicUnitId').patchValue(resp.id)
    //         this.getCampusDetail(resp.campusId)
    //         // this.getBuildings({value:resp.id})
    //     })
    // }
    // getCampusDetail(id){
    //     this.campusService.getCampusById(id).subscribe((resp:any)=>{
    //         this.lessonForm.get('campusId').patchValue(resp.id)
    //         this.getAcademicUnits({value:resp.id})

    //     })
    // }


}