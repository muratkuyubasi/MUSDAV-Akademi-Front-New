import { Component, OnInit } from '@angular/core';
import { CampusService } from '../../campus.service';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-manage-academicunit',
    templateUrl: 'manage-academicunit.component.html'
})

export class ManageAcademicUnitComponent extends BaseComponent implements OnInit {
    academicUnit:any;
    campus:any;
    isEditMode = false;
    academicUnitForm: UntypedFormGroup;

    constructor(
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
        this.createAcademicUnitForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { campus: any,academicUnit:any }) => {
              if (data.campus) {

                this.campus = data.campus;
                if(data.academicUnit){
                  this.academicUnit = data.academicUnit;
                  this.isEditMode = true;
                  this.academicUnitForm.patchValue(data.academicUnit);
                }
              } 
          });

          this.allRecord()
          
    }

    createAcademicUnitForm(){
        this.academicUnitForm = this.fb.group({
            id: [''],
            code:[''],
            telephone:[''],
            address:[''],
            campusId:[this.campus?.id],
            academicUnitRecords:this.fb.array([])
        })
        
       
    }

    get academicUnitRecords(): UntypedFormArray {
        return this.academicUnitForm.get("academicUnitRecords") as UntypedFormArray
    }

    newRecord(): UntypedFormGroup {
        return this.fb.group({
          id: [''],
          academicUnitId:[''],
          languageCode:[''],
          name: ['']
        })
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
              let newRecord=   this.fb.group({
                      id: [this.academicUnit?.academicUnitRecords[i] ? this.academicUnit?.academicUnitRecords[i].id:0],
                      campusId:[this.academicUnit? this.academicUnit?.id: 0],
                      languageCode:[this.academicUnit?.academicUnitRecords[i] ? this.academicUnit?.academicUnitRecords[i].languageCode: record],
                      name: [this.academicUnit?.academicUnitRecords[i] ? this.academicUnit?.academicUnitRecords[i].name: '']
                    })
                    this.academicUnitRecords.push(newRecord);
                  i++;
              }      
       
       

      }
    

    saveAcademicUnitForm(){
        if (this.academicUnitForm.valid) {
            const academicUnit = this.createAcademicUnitObject();
            if (this.isEditMode) {
                this.sub$.sink = this.campusService.updateAcademicUnit(academicUnit).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.campusService.addAcademicUnit(academicUnit).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/campuses']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.academicUnit.markAllAsTouched();
          }
     }

     createAcademicUnitObject(){
        const id = this.academicUnit?.id;
        const code = this.academicUnit?.code;
        const campusId=this.campus?.id;
        const academicUnit = {
            id:id,
            code:code,
            campusId:campusId,
            address:this.academicUnitForm.get('address').value,
            telephone:this.academicUnitForm.get('telephone').value,
            academicUnitRecords: (this.academicUnitRecords.value as any[]).filter(c => c.name)
            
        }

        return academicUnit;
     }
}