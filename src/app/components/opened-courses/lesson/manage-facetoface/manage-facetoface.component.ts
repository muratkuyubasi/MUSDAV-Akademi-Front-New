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
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CampusService } from 'src/app/components/campus/campus.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-manage-facetoface',
    templateUrl: 'manage-facetoface.component.html'
})

export class ManageFacetoFaceCourseDetailComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    @Input() section:any;
    detailForm: UntypedFormGroup;
    selectedDays: any[] = [];
    days:any[]=[]
    lessonDays:any[]=[];
    showButton:boolean=false;
    events: string[] = [];
    openedCourseLessons:[]=[];
    displayedColumns: string[] = ['startLessonTime', 'day', 'hour', 'duration','classroom','option'];
    dataSource = new MatTableDataSource();
    campuses:any[]=[];
    academicUnits:any[]=[];
    buildings:any[]=[];
    classrooms:any[]=[];
    classroom:any;
    branches:any[]=[];
    selectedBranche:any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        private msService:OpenedCoursesService,
        private campusService:CampusService,
        private fb: UntypedFormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService,
        private commonDialogService: CommonDialogService,
        public translate: TranslateService,
    ) {
        super()
     }

    ngOnInit() { 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        const forLang = this.course.openedCourseRecords.filter(item=>item.languageCode == this.defaultLang$)[0];
        this.course.openedCourseRecords = forLang;
        this.getCampuses();
        this.getCourseDays();
        this.createCourseForm();
        this.dataSource = new MatTableDataSource(this.section.openedCourseLessons)
        this.openedCourseLessons = this.section.openedCourseLessons;
        this.getOpenedCourseBranches()
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

    getOpenedCourseBranches(){
        this.msService.getOpenedCourseBranches(this.course.id).subscribe(resp=>{
            console.log("BRANCHES",resp)
            this.branches = resp
        })
    }
    checkClassroom(e){
        this.classroom = this.classrooms.filter(item=>item.id==e.value)[0];
        console.log("Seçili Şube",this.selectedBranche)
        if(this.selectedBranche!=undefined){
            if(this.selectedBranche.brancheQuota > this.classroom.capacity){
                this.toastrService.error(this.translationService.getValue('Sınıf Kapasitesi Kurs Kontenjanından Düşük'));
            }
        }
        else{
            
            if(this.branches.length==1){
                if(this.course.courseQuota > this.classroom.capacity){
                    this.toastrService.error(this.translationService.getValue('Sınıf Kapasitesi Kurs Kontenjanından Düşük'));
                }
            }    
        }
        
        
        
    }
    checkBranche(e){
        this.selectedBranche = this.branches.filter(item=>item.id==e.value)[0];
        if(this.selectedBranche.brancheQuota > this.classroom.capacity){
            this.toastrService.error(this.translationService.getValue('Sınıf Kapasitesi Kurs Kontenjanından Düşük'));
        }
    }

    getCourseDays(){
        this.msService.getCourseDays().subscribe((resp:any)=>{
            this.days = resp.data
        })
    }

     getClassroomDetail(id){
        if(id != null || id !=''){
          this.campusService.getClassroomById(id).subscribe((resp)=>{
                this.classroom = resp.classroomRecords[0].name
            })

        }
        // return id
    }

    createCourseForm(){
        let dateTime = moment().add(3,'hours')
        this.detailForm = this.fb.group({
            openedCourseSectionId:[this.section?.id],
            classroomId:[],
            openedCourseBrancheId:[],
            totalWeeks:[3],
            daysOfWeek:[1],
            perLessonTime:[30],
            startLessonTime:[dateTime.toISOString().substring(0, 16)],
        })

    }

    createLessons(){
        const totalWeeks = this.detailForm.get('totalWeeks').value
        const daysOfWeek = this.detailForm.get('daysOfWeek').value
        const perLessonTime = this.detailForm.get('perLessonTime').value
        const startLessonTime = this.detailForm.get('startLessonTime').value
        const brancheId = this.detailForm.get('openedCourseBrancheId').value

        let theDate = moment(startLessonTime).format("DD-MM-YYYY HH:mm")
        this.showButton = false;
        for(let i=0; i<totalWeeks; i++){
            let week= moment(theDate,'DD-MM-YYYY HH:mm').add(i,'weeks')
            this.lessonDays.push({
                openedCourseSectionId: this.section.id,
                openedCourseBrancheId:brancheId,
                dateTime: week.format('DD-MM-YYYY'),
                day:week.format("dddd"),
                hour:week.format("HH:mm"),
                duration:perLessonTime,
                classroomId:this.classroom.id,
                classroom:this.classroom.classroomRecords[0].name,
                isFaceToFace:true,
                isSynchronous:false,
                isASynchronous:false,
                virtualClassUrl: "string",
                videoUrl: "string",
                startLessonTime:week,
                openedCourseLessonRecords: [
                    {
                        title: (i+1)+". ders",
                        description: "",
                        languageCode: "tr"
                    },
                    {
                        title: (i+1)+". lesson",
                        description: "",
                        languageCode: "en"
                    }
                ]

            })
        }

    }

    saveLessons(){
        this.msService.addOpenedCourseLesson(this.lessonDays).subscribe(resp=>{
            if(resp.data.length ==1){
                this.router.navigate(['/admin/opened-courses/manage-lesson',resp.data[0].code])
            }
            this.lessonDays.length=0;
        })
      }


    getSelectedDays() {
        return this.selectedDays.map((day) => {
          return {
            // userId: this.userForm.get('id').value,
            // roleId: role.id
          }
        })
      }

      
      setButton(){
        this.showButton = true;
      }
      addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.showButton = true;
        this.events.push(`${type}: ${event.value}`);
      }

      applyFilter(filterValue) {
        this.dataSource.filter = filterValue.value.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }

      lessonDetail(lesson){
        this.router.navigate(['/admin/opened-courses/manage-lesson',lesson.code])
      }


}