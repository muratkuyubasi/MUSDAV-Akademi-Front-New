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
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-manage-branch',
    templateUrl: 'manage-branch.component.html'
})

export class ManageBranchComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    detailForm: UntypedFormGroup;
    branch:any;
    displayedColumns: string[] = ['title','quota','option'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    isEditMode:boolean = false;
    openedCourseBranches:[]=[];

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

        this.getOpenedCourseBranches()
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.createBrancheForm();

        this.allRecord()

     }

     getOpenedCourseBranches(){
        this.msService.getOpenedCourseBranches(this.course?.id).subscribe((resp:any)=>{
          this.openedCourseBranches = resp
          this.dataSource = new MatTableDataSource(resp)
        })
    }

     createBrancheForm(){
        this.detailForm = this.fb.group({
            openedCourseId:[this.course?.id],
            brancheQuota:[0],
            openedCourseBrancheRecords:this.fb.array([])
        })

     }

    get openedCourseBrancheRecords(): UntypedFormArray {
        return this.detailForm.get("openedCourseBrancheRecords") as UntypedFormArray

    }

    allRecord() {
        let i = 0;
        for (let record of this.translate.getLangs()) {
          // console.log(record)
            let newRecord=   this.fb.group({
                  id: [this.branch ? this.branch.openedCourseBrancheRecords[i].id : 0],
                  openedCourseBrancheId:[this.branch ? this.branch.openedCourseBrancheRecords[i].openedCourseBrancheId : 0],
                  languageCode:[record],
                  title: ['']
                })
                this.openedCourseBrancheRecords.push(newRecord);
              i++;
          }      
    }

    createFormObject(){
        const id = this.branch?.id;
        const code = this.branch?.code;
        const branch = {
            id:id,
            code:code,
            brancheQuota:this.detailForm.get("brancheQuota").value,
            openedCourseId:this.course?.id,
            openedCourseBrancheRecords: (this.openedCourseBrancheRecords.value as any[]).filter(c => c.title) 
        }

        return branch;
     }

     saveSection(){
        if (this.detailForm.valid) {
            const branch = this.createFormObject();
            if (this.isEditMode) {
              this.sub$.sink = this.msService.updateOpenedCourseBranch(branch).subscribe(() => {
                this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));
                this.getOpenedCourseBranches()
              });
            }
            else{
              this.sub$.sink = this.msService.addOpenedCourseBranch(branch).subscribe((resp) => {
                this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                this.getOpenedCourseBranches()
               });
            }
            

                
            
        } else {
            this.detailForm.markAllAsTouched();
          }
    }


    sectionDetail(branche){
      this.branch = branche;
      this.isEditMode = true;

      this.detailForm.patchValue(branche)

      console.log(branche);

        // this.router.navigate(['/admin/opened-courses/manage-lesson',lesson.code])
      }

      deleteSection(branche){
          
        const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')
        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${areU}:: ${branche.openedCourseSectionRecords[0].title}`)
        .subscribe((flag: boolean) => {
            if (flag) {
            this.sub$.sink = this.msService.deleteOpenedCourseSection(branche.code)
                .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                  this.getOpenedCourseBranches()
                });
            }
        });
    }
}