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
    selector: 'app-manage-building',
    templateUrl: 'manage-building.component.html'
})

export class ManageBuildingComponent extends BaseComponent implements OnInit {
    building:any;
    academicUnit:any;
    isEditMode = false;
    buildingForm: UntypedFormGroup;

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
        this.createBuildingForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { building: any,academicUnit:any }) => {
              if (data.academicUnit) {
                this.academicUnit = data.academicUnit;
                if(data.building){
                  this.building = data.building;
                  this.isEditMode = true;
                  this.buildingForm.patchValue(data.building);
                }
              } 
          });

          this.allRecord()
          
    }

    createBuildingForm(){
        this.buildingForm = this.fb.group({
            id: [''],
            code:[''],
            academicUnitId:[this.academicUnit?.id],
            buildingRecords:this.fb.array([])
        })
        
       
    }

    get buildingRecords(): UntypedFormArray {
        return this.buildingForm.get("buildingRecords") as UntypedFormArray
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
                      id: [this.building ? this.building.buildingRecords[i].id : 0],
                      academicUnitId:[this.academicUnit?.id],
                      languageCode:[this.building ?.buildingRecords[i] ? this.building?.buildingRecords[i].languageCode: record],
                      name: [this.building?.buildingRecords[i] ? this.building?.buildingRecords[i].name: '']
                    })
                    this.buildingRecords.push(newRecord);
                  i++;
              }      
       
       

      }
    

    saveBuildingForm(){
        if (this.buildingForm.valid) {
            const building = this.createBuildingObject();
            if (this.isEditMode) {
                this.sub$.sink = this.campusService.updateBuilding(building).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.campusService.addBuilding(building).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/campuses']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.building.markAllAsTouched();
          }
     }

     createBuildingObject(){
        const id = this.building?.id;
        const code = this.building?.code;
        const academicUnitId=this.academicUnit?.id;
        const building = {
            id:id,
            code:code,
            academicUnitId:academicUnitId,
            buildingRecords: (this.buildingRecords.value as any[]).filter(c => c.name)
            
        }
        return building;
     }
}