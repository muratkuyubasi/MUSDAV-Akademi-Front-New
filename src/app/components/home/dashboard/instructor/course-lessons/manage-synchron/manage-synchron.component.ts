import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { InstructorService } from '../../instructor.service';


@Component({
    selector: 'app-manage-ins-synchron',
    templateUrl: 'manage-synchron.component.html'
})

export class ManageInsSynchronCourseDetailComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    @Input() section:any;

    detailForm: UntypedFormGroup;
    selectedDays: any[] = [];
    days:any[]=[]
    lessonDays:any[]=[];
    showButton:boolean=false;
    events: string[] = [];
    openedCourseSections:[]=[];
    openedCourseLessons:[]=[];
    displayedColumns: string[] = ['startLessonTime', 'day', 'hour', 'duration','option'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        private insService:InstructorService,
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
        this.getCourseDays();
        this.createCourseForm();
        this.dataSource = new MatTableDataSource(this.section.openedCourseLessons)
        this.openedCourseLessons = this.course.openedCourseLessons;
    }

    getCourseDays(){
        this.insService.getCourseDays().subscribe((resp:any)=>{
            this.days = resp.data
        })
    }

    createCourseForm(){
        let dateTime = moment().add(1,'hours')
        this.detailForm = this.fb.group({
            openedCourseSectionId:[this.section?.id],
            totalWeeks:[1],
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

        let theDate = moment(startLessonTime).format("DD-MM-YYYY HH:mm")
        this.showButton = false;
        for(let i=0; i<totalWeeks; i++){
            let week= moment(theDate,'DD-MM-YYYY HH:mm').add(i,'weeks')
            this.lessonDays.push({
                openedCourseSectionId: this.section.id,
                dateTime: week.format('DD-MM-YYYY'),
                day:week.format("dddd"),
                hour:week.format("HH:mm"),
                duration:perLessonTime,
                classroom:'virtual',
                isFaceToFace:false,
                isSynchronous:true,
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
        this.insService.addOpenedCourseLesson(this.lessonDays).subscribe(resp=>{
        
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

// [
//     {
//       "openedCourseId": 1,
//       "startLessonTime": "2023-05-22T10:19:13.000Z",
//       "day": "pazar",
//       "hour":"12:00:00",
//       "virtualClassUrl": "string",
//       "videoUrl": "string",
//       "duration": 30,
//       "isFacetoFace": false,
//       "isSynchronous": true,
//       "isASynchronous": false,
//       "openedCourseLessonRecords": [
//         {
//           "title": "tt",
//           "description": "tt",
//           "languageCode": "tr"
//         }
//       ]
//     },
//     {
//       "openedCourseId": 1,
//       "startLessonTime": "2023-05-29T10:19:13.000Z",
//       "day": "pazar",
//       "hour":"12:00:00",
//       "virtualClassUrl": "string",
//       "videoUrl": "string",
//       "duration": 30,
//       "isFacetoFace": false,
//       "isSynchronous": true,
//       "isASynchronous": false,
//       "openedCourseLessonRecords": [
//         {
//           "title": "tt",
//           "description": "tt",
//           "languageCode": "tr"
//         }
//       ]
//     }
//   ]