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
    selector: 'app-manage-classroom',
    templateUrl: 'manage-classroom.component.html'
})

export class ManageClassroomComponent extends BaseComponent implements OnInit {
    building:any;
    classroom:any;
    isEditMode = false;
    classroomForm: UntypedFormGroup;
    classroomTypes:any[]=[];

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
      this.getClassroomTypes();
        this.createClassroomForm();
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { building: any,classroom:any }) => {
              if (data.building) {
                this.building = data.building;
                if(data.classroom){
                  this.classroom = data.classroom;
                  this.isEditMode = true;
                  this.classroomForm.patchValue(data.classroom);
                  this.classroomForm.get('classroomTypeId').patchValue(data.classroom.classRoomTypeId)
                }
              } 
          });

          this.allRecord()
          
    }

    getClassroomTypes(){
      this.campusService.getClassroomTypes().subscribe((resp:any)=>{
        this.classroomTypes = resp.data
      })
    }

    createClassroomForm(){
        this.classroomForm = this.fb.group({
            id: [''],
            code:[''],
            buildingId:[this.building?.id],
            classroomTypeId:[],
            capacity:[],
            floor:[''],
            classroomRecords:this.fb.array([])
        })
        
       
    }

    get classroomRecords(): UntypedFormArray {
        return this.classroomForm.get("classroomRecords") as UntypedFormArray
    }

    newRecord(): UntypedFormGroup {
        return this.fb.group({
          id: [''],
          classroomId:[''],
          languageCode:[''],
          name: ['']
        })
    }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
              let newRecord=   this.fb.group({
                      id: [this.classroom ? this.classroom.classroomRecords[i].id : 0],
                      buildingId:[this.building?.id],
                      languageCode:[this.classroom ?.classroomRecords[i] ? this.classroom?.classroomRecords[i].languageCode: record],
                      name: [this.classroom?.classroomRecords[i] ? this.classroom?.classroomRecords[i].name: '']
                    })
                    this.classroomRecords.push(newRecord);
                  i++;
              }      
       
       

      }
    

    saveClassroomForm(){
        if (this.classroomForm.valid) {
            const classroom = this.createClassroomObject();
            if (this.isEditMode) {
                this.sub$.sink = this.campusService.updateClassroom(classroom).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                
                });
              } else {
                this.sub$.sink = this.campusService.addClassroom(classroom).subscribe((resp) => {
                    
                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  this.router.navigate(['/admin/campuses']);
                //   this.router.navigate(['/admin/campuses/manage/'+resp?.code]);
                
                });
              }
        } else {
            this.building.markAllAsTouched();
          }
     }

     createClassroomObject(){
        const id = this.classroom?.id;
        const code = this.classroom?.code;
        const buildingId=this.building?.id;
        const classroom = {
            id:id,
            code:code,
            capacity:this.classroomForm.get('capacity').value,
            floor:this.classroomForm.get('floor').value,
            classroomTypeId:this.classroomForm.get('classroomTypeId').value,
            buildingId:buildingId,
            classroomRecords: (this.classroomRecords.value as any[]).filter(c => c.name)
            
        }
        return classroom;
     }
}