import { Component, OnInit } from '@angular/core';
import { CampusService } from '../campus.service';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-manage-campus',
    templateUrl: 'manage-campus.component.html'
})

export class ManageCampusComponent extends BaseComponent implements OnInit {
    campus:any;
    isEditMode = false;
    campusForm: UntypedFormGroup;

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
        this.createCampusForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { campus: any }) => {
              if (data.campus) {
                this.campus = data.campus;
                this.isEditMode = true;
                this.campusForm.patchValue(data.campus);
              } 
          });

          this.allRecord()
          
    }

    createCampusForm(){
        this.campusForm = this.fb.group({
            id: [''],
            code:[''],
            telephone:[''],
            address:[''],
            campusRecords:this.fb.array([])
        })
        
       
    }

    get campusRecords(): UntypedFormArray {
        return this.campusForm.get("campusRecords") as UntypedFormArray
    }

    newRecord(): UntypedFormGroup {
        return this.fb.group({
          id: [''],
          campusId:[''],
          languageCode:[''],
          name: ['']
        })
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.campus?.campusRecords[i] ? this.campus?.campusRecords[i].id:0],
                      campusId:[this.campus? this.campus?.id: 0],
                      languageCode:[this.campus?.campusRecords[i] ? this.campus?.campusRecords[i].languageCode: record],
                      name: [this.campus?.campusRecords[i] ? this.campus?.campusRecords[i].name: '']
                    })
                    this.campusRecords.push(newRecord);
                  i++;
              }      
       
       

      }
    

    saveCampus(){
        if (this.campusForm.valid) {
            const campus = this.createCampusObject();
            if (this.isEditMode) {
                this.sub$.sink = this.campusService.updateCampus(campus).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.campusService.addCampus(campus).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/campuses']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.campusForm.markAllAsTouched();
          }
     }

     createCampusObject(){
        const id = this.campus?.id;
        const code = this.campus?.code;
        const campus = {
            id:id,
            code:code,
            address:this.campusForm.get('address').value,
            telephone:this.campusForm.get('telephone').value,
            campusRecords: (this.campusRecords.value as any[]).filter(c => c.name)
            
        }

        return campus;
     }
}