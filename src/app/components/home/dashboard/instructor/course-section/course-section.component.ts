import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { InstructorService } from '../instructor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-instructor-section',
    templateUrl: 'course-section.component.html'
})

export class CourseSectionComponent extends BaseComponent implements OnInit {

    @Input() course:any;
    detailForm: UntypedFormGroup;
    selectedDays: any[] = [];
    days:any[]=[]
    lessonDays:any[]=[];
    showButton:boolean=false;
    section: any;
    openedCourseSections:[]=[];
    openedCourseLessons:[]=[];
    isEditMode:boolean = false;

    constructor(
        private insService:InstructorService,
        private fb: UntypedFormBuilder,
        private router: Router,
        private toastrService: ToastrService,
        private commonService: CommonService,
        private translationService:TranslationService,
        private commonDialogService: CommonDialogService,
        public translate: TranslateService,
    ) {
        super()
     }

    ngOnInit() {
        this.createSectionForm();
        this.allRecord();
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
              this.sub$.sink = this.insService.updateOpenedCourseSection(section).subscribe(() => {
                this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                // this.getOpenedCourseSections()
              });
            }
            else{
              this.sub$.sink = this.insService.addOpenedCourseSection(section).subscribe((resp) => {
                this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                // this.getOpenedCourseSections()
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
            this.sub$.sink = this.insService.deleteOpenedCourseSection(section.code)
                .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                //   this.getOpenedCourseSections()
                });
            }
        });
    }

    goToLessons(code){
      this.router.navigate(['/admin/opened-courses/lessons',code])
    }
}