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


@Component({
    selector: 'app-manage-section',
    templateUrl: 'manage-section.component.html'
})

export class ManageSectionComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    detailForm: UntypedFormGroup;
    selectedDays: any[] = [];
    days:any[]=[]
    lessonDays:any[]=[];
    showButton:boolean=false;
    section: any;
    openedCourseSections:[]=[];
    openedCourseLessons:[]=[];
    displayedColumns: string[] = ['title','lesson','option'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    isEditMode:boolean = false;
    

    constructor(
        private msService:OpenedCoursesService,
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

      this.getOpenedCourseSections()

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        const forLang = this.course.openedCourseRecords.filter(item=>item.languageCode == this.defaultLang$)[0];

        this.course.openedCourseRecords = forLang;


        this.createSectionForm();


        // this.dataSource = new MatTableDataSource(this.courseSections)
        // this.openedCourseSections = this.course.openedCourseSections;



        this.allRecord()
    }

    getOpenedCourseSections(){
        this.msService.getOpenedCourseSections(this.course?.id).subscribe((resp:any)=>{
          this.openedCourseSections = resp
          console.log(this.openedCourseSections)
          this.dataSource = new MatTableDataSource(resp)
            

        })
    }

     createSectionForm(){
        this.detailForm = this.fb.group({
            openedCourseId:[this.course?.id],
            openedCourseSectionRecords:this.fb.array([])
        })

     }

    get openedCourseSectionRecords(): UntypedFormArray {
         return this.detailForm.get("openedCourseSectionRecords") as UntypedFormArray
    }

    allRecord() {
            let i = 0;
            for (let record of this.translate.getLangs()) {
              // console.log(record)
                let newRecord=   this.fb.group({
                      id: [this.section ? this.section.openedCourseSectionRecords[i].id : 0],
                      openedCourseSectionId:[this.section ? this.section.openedCourseSectionRecords[i].openedCourseSectionId : 0],
                      languageCode:[record],
                      title: [''],
                      description:['']
                    })
                    this.openedCourseSectionRecords.push(newRecord);
                  i++;
              }      
    }

    createFormObject(){
        const id = this.section?.id;
        const code = this.course?.code;
        const section = {
            id:id,
            code:code,
            openedCourseId:this.course?.id,
            openedCourseSectionRecords: (this.openedCourseSectionRecords.value as any[]).filter(c => c.title) 
        }

        return section;
    }

    saveSection(){
        if (this.detailForm.valid) {
            const section = this.createFormObject();
            if (this.isEditMode) {
              this.sub$.sink = this.msService.updateOpenedCourseSection(section).subscribe(() => {
                this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                this.getOpenedCourseSections()
              });
            }
            else{
              this.sub$.sink = this.msService.addOpenedCourseSection(section).subscribe((resp) => {
                this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                this.getOpenedCourseSections()
               });
            }
            

                
            
        } else {
            this.detailForm.markAllAsTouched();
          }
    }


    sectionDetail(section){
      this.section = section;
      this.isEditMode = true;

      this.detailForm.patchValue(section)

      console.log(section);

        // this.router.navigate(['/admin/opened-courses/manage-lesson',lesson.code])
    }

    deleteSection(section){
          
        const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${areU}:: ${section.openedCourseSectionRecords[0].title}`)
        .subscribe((flag: boolean) => {
            if (flag) {
            this.sub$.sink = this.msService.deleteOpenedCourseSection(section.code)
                .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                  this.getOpenedCourseSections()
                });
            }
        });
    }

    goToLessons(code){
      this.router.navigate(['/admin/opened-courses/lessons',code])
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