import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { OpenedCoursesService } from '../../opened-courses.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MainCoursesService } from '../../../main-courses/main-courses.service'

@Component({
    selector: 'app-manage-course',
    templateUrl: 'manage-course.component.html',
    styleUrls:['./manage-course.component.scss']
})

export class ManageOpenedCourseComponent extends BaseComponent implements OnInit {
    mainCourses:any[]=[];
    course:any;
    isEditMode = false;
    showDetail = false;
    courseForm: UntypedFormGroup;
    types:any[]=[]
    fileSelected: File;
    formData=new FormData();
    picture:any;
    showPermission:boolean=false;
    public Editor = ClassicEditor;
    public config = {
      toolbar: [ 'heading', '|',
        'fontfamily','fontsize',
        'alignment',
        'fontColor','fontBackgroundColor', '|',
        'bold', 'italic', 'custombutton', 'strikethrough','underline','subscript','superscript','|',
        'link','|',
        'outdent','indent','|',
        'bulletedList','numberedList','|',
        'code','codeBlock','|',
        'insertTable','|',
        // 'imageUpload',
        'blockQuote','|',
        'undo','redo','|',
        'youtube',
        'mediaEmbed'
      ]
    }
    constructor(
        private ocService:OpenedCoursesService,
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
                console.log("KURS",this.course)

                
                this.isEditMode = true;
                this.courseForm.patchValue(data.course);
              }
          });

          this.allRecord()
          this.getAllCourses()
          this.getAllOpenedCourseTypes()


    }

    getAllOpenedCourseTypes(){
      this.ocService.getAllOpenedCourseType().subscribe(resp=>{
        this.types = resp.data
      })
    }

    getAllCourses(){
      this.msService.getAllCourse().subscribe(resp=>{
        this.mainCourses = resp.data
        console.log(this.mainCourses)
      })
    }

    createCourseForm(){

        this.courseForm = this.fb.group({
            id: [''],
            code:[''],
            openedCourseTypeId:[''],
            courseId:[''],
            coursePicture:[''],
            courseQuota:[0],
            isConfirmed:[false],
            isPopuler:[false],
            isPublish:[false],
            isRecommend:[false],
            file: new FormControl(''),
            fileSource: new FormControl(''),
            openedCourseRecords:this.fb.array([])
        })


    }

    get openedCourseRecords(): UntypedFormArray {
        return this.courseForm.get("openedCourseRecords") as UntypedFormArray
    }

    // newRecord(): UntypedFormGroup {
    //     return this.fb.group({
    //       id: [''],
    //       openedCourseId:[''],
    //       title: [''],
    //       slug: [''],
    //       shortDescription:[''],
    //       description:[''],
    //       coursePrice:['0'],
    //       priceSymbol:[''],
    //       languageCode:['']
    //     })
    // }

    allRecord() {
        let i = 0;
            for (let record of this.translate.getLangs()) {
                let newRecord=   this.fb.group({
                      id: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].id:0],
                      openedCourseId:[this.course? this.course?.id: 0],
                      languageCode:[this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].languageCode: record],
                      title: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].title: ''],
                      shortDescription: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].shortDescription: ''],
                      description: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].description: ''],
                      coursePrice: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].coursePrice: ''],
                      priceSymbol: [this.course?.openedCourseRecords[i] ? this.course?.openedCourseRecords[i].priceSymbol: '']
                    })
                    this.openedCourseRecords.push(newRecord);
                  i++;
              }
    }


    saveCourse(){
        if (this.courseForm.valid) {
            const data = this.createFormObject();
        
            if (this.isEditMode) {
                this.sub$.sink = this.ocService.updateOpenedCourse(data).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));

                });
              } else {
                this.sub$.sink = this.ocService.addOpenedCourse(data).subscribe((resp) => {

                  this.toastrService.success(this.translationService.getValue('CREATED_SUCCESSFULLY'));
                  // this.router.navigate(['/admin/courses']);
                  this.router.navigate(['/admin/opened-courses/manage-opened-course/'+resp?.code]);

                });
              }
        } else {
            this.courseForm.markAllAsTouched();
          }
     }

     createFormObject(){

      const openedCourses = (this.openedCourseRecords.value as any[]).filter(c => c.title);
   
        const formData = new FormData();
        formData.append('id', this.course ? this.course?.id :0);
        formData.append('code', this.course ? this.course?.code :'');
        formData.append('courseId', this.course ? this.course?.courseId:'0');
        formData.append('openedCourseTypeId', this.courseForm.get('openedCourseTypeId').value);
        formData.append('isConfirmed', this.courseForm.get('isConfirmed').value);
        formData.append('isPopuler', this.courseForm.get('isPopuler').value);
        formData.append('isPublish', this.courseForm.get('isPublish').value);
        formData.append('isRecommend', this.courseForm.get('isRecommend').value);
        formData.append('courseQuota', this.courseForm.get('courseQuota').value);
        formData.append('formFile', this.courseForm.get('fileSource').value);
        formData.append('StringCourseRecords', JSON.stringify(openedCourses));

        return formData;
       
     }

     createData(){
      const id = this.course?.id;
      const code = this.course?.code;
      const data = {
        id:id,
        code:code,
        openedCourseTypeId:this.courseForm.get('openedCourseTypeId').value,
        isConfirmed: this.courseForm.get('isConfirmed').value,
        isPopuler: this.courseForm.get('isPopuler').value,
        isPublish: this.courseForm.get('isPublish').value,
        isRecommend: this.courseForm.get('isRecommend').value,
        courseQuota: this.courseForm.get('courseQuota').value,
        openedCourseRecords: (this.openedCourseRecords.value as any[]).filter(c => c.title)
    }

    return data;
     }

     onFileChange(event) {

      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }
        this.courseForm.patchValue({
          fileSource: file
        });
      }
    }

     fileEvent(event) {

      const file = event.target.files[0];

        if (!file) {
          return;
        }
        const mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }

        this.courseForm.controls['formFile'].patchValue(file);


  }
}