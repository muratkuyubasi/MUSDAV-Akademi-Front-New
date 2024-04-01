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
    selector: 'app-manage-category',
    templateUrl: 'manage-category.component.html'
})

export class ManageCategoryComponent extends BaseComponent implements OnInit {
    category:any;
    isEditMode = false;
    categoryForm: UntypedFormGroup;

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
        this.createCategoryForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { category: any }) => {
              if (data.category) {
                this.category = data.category;
                this.isEditMode = true;
                this.categoryForm.patchValue(data.category);
              } 
          });

          this.allRecord()
          
    }

    createCategoryForm(){
        this.categoryForm = this.fb.group({
            id: [''],
            code:[''],
            categoryPicture:[''],
            icon:[''],
            color:[''],
            courseCategoryRecords:this.fb.array([])
        })
        
       
    }

    get courseCategoryRecords(): UntypedFormArray {
        return this.categoryForm.get("courseCategoryRecords") as UntypedFormArray
    }

    newRecord(): UntypedFormGroup {
        return this.fb.group({
          id: [''],
          courseCategoryId:[''],
          languageCode:[''],
          name: [''],
          slug: ['']
        })
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.category?.courseCategoryRecords[i] ? this.category?.courseCategoryRecords[i].id:0],
                      campusId:[this.category? this.category?.id: 0],
                      languageCode:[this.category?.courseCategoryRecords[i] ? this.category?.courseCategoryRecords[i].languageCode: record],
                      name: [this.category?.courseCategoryRecords[i] ? this.category?.courseCategoryRecords[i].name: '']
                    })
                    this.courseCategoryRecords.push(newRecord);
                  i++;
              }      
      }
    

    saveCategory(){
        if (this.categoryForm.valid) {
            const campus = this.createFormObject();
            if (this.isEditMode) {
                this.sub$.sink = this.msService.updateCategory(campus).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.msService.addCategory(campus).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/courses/categories']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.categoryForm.markAllAsTouched();
          }
    }

     createFormObject(){
        const id = this.category?.id;
        const code = this.category?.code;
        const category = {
            id:id,
            code:code,
            categoryPicture:this.categoryForm.get('categoryPicture').value,
            icon:this.categoryForm.get('icon').value,
            color:this.categoryForm.get('color').value,
            courseCategoryRecords: (this.courseCategoryRecords.value as any[]).filter(c => c.name)
            
        }

        return category;
     }
}