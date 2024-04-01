import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MainCoursesService } from '../../main-courses.service';

@Component({
    selector: 'app-manage-course',
    templateUrl: 'manage-course.component.html'
})

export class ManageCourseComponent extends BaseComponent implements OnInit {
    course:any;
    isEditMode = false;
    courseForm: UntypedFormGroup;
    categories:any[]=[];

    constructor(
        private msService:MainCoursesService,
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
        this.createCourseForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { course: any }) => {
              if (data.course) {
                this.course = data.course;
                this.isEditMode = true;
                this.courseForm.patchValue(data.course);
              } 
          });

          this.allRecord()
          this.getCourseCategories()
          
    }

    getCourseCategories(){
      this.msService.getAllCategory().subscribe((resp:any)=>{
        this.categories = resp.data;
      })
    }

    createCourseForm(){
        this.courseForm = this.fb.group({
            id: [''],
            code:[''],
            courseCategoryId:[''],
            isConfirm:[''],
            courseRecords:this.fb.array([])
        })
        
       
    }

    get courseRecords(): UntypedFormArray {
        return this.courseForm.get("courseRecords") as UntypedFormArray
    }

    newRecord(): UntypedFormGroup {
        return this.fb.group({
          id: [''],
          courseId:[''],
          name: [''],
          slug: [''],
          languageCode:['']
        })
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.course?.courseRecords[i] ? this.course?.courseRecords[i].id:0],
                      courseId:[this.course? this.course?.id: 0],
                      languageCode:[this.course?.courseRecords[i] ? this.course?.courseRecords[i].languageCode: record],
                      name: [this.course?.courseRecords[i] ? this.course?.courseRecords[i].name: '']
                    })
                    this.courseRecords.push(newRecord);
                  i++;
              }      
      }
    

    saveCourse(){
        if (this.courseForm.valid) {
            const data = this.createFormObject();
            if (this.isEditMode) {
                this.sub$.sink = this.msService.updateCourse(data).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.msService.addCourse(data).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/courses']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.courseForm.markAllAsTouched();
          }
     }

     createFormObject(){
        const id = this.course?.id;
        const code = this.course?.code;
        const data = {
            id:id,
            code:code,
            courseCategoryId:this.courseForm.get('courseCategoryId').value,
            isConfirm: this.courseForm.get('isConfirm').value,
            courseRecords: (this.courseRecords.value as any[]).filter(c => c.name)
            
        }

        return data;
     }
}