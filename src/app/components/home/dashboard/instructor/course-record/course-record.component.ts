import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';
import { OpenedCoursesService } from 'src/app/components/opened-courses/opened-courses.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
    selector: 'app-instructor-course-record',
    templateUrl: 'course-record.component.html'
})

export class InstructorCourseRecordComponent extends BaseComponent implements OnInit {
    @Input() course:any;
    @Input() userId:any;
    
    isEditMode = false;
    showDetail = false;
    courseForm: UntypedFormGroup;
    types:any[]=[]
    fileSelected: File;
    mainCourses:any[]=[];
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
        private insService:InstructorService,
        private fb:UntypedFormBuilder,
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

        if(this.course !=null){
            this.isEditMode = true;
            
        }
        

        this.createCourseForm();
        this.allRecord()
        this.getAllCourses()
        this.getAllOpenedCourseTypes()
     }

     getAllOpenedCourseTypes(){
        this.insService.getAllOpenedCourseType().subscribe(resp=>{
          this.types = resp.data
        })
      }
  
      getAllCourses(){
        this.insService.getAllCourse().subscribe(resp=>{
          this.mainCourses = resp.data
        })
      }

     createCourseForm(){
        this.courseForm = this.fb.group({
            id: [this.course?.id],
            code:[this.course?.code],
            openedCourseTypeId:[this.course?.openedCourseTypeId],
            courseId:[this.course?.courseId],
            coursePicture:[this.course?.coursePicture],
            courseQuota:[this.course?.courseQuota],
            isConfirmed:[this.course?.isConfirmed],
            isPopuler:[this.course?.isPopuler],
            isPublish:[this.course?.isPublish],
            isRecommend:[this.course?.isRecommend],
            file: new FormControl(''),
            fileSource: new FormControl(''),
            openedCourseRecords:this.fb.array([]),
            openedCourseTeacher:[{
              userId:this.userId,
              isActive:false
            }]
        })
    }

    get openedCourseRecords(): UntypedFormArray {
        return this.courseForm.get("openedCourseRecords") as UntypedFormArray
    }

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
    
     saveCourse(){
        if (this.courseForm.valid) {
            const data = this.createFormObject();
        
            if (this.isEditMode) {
                this.sub$.sink = this.insService.updateOpenedCourse(data).subscribe(() => {
                  this.toastrService.success(this.translationService.getValue('UPDATED_SUCCESSFULLY'));

                });
              } else {
                this.sub$.sink = this.insService.addOpenedCourse(data).subscribe((resp) => {
                  
                  this.toastrService.success(this.translationService.getValue('HOMEPAGE.CREATED_SUCCESSFULLY_NEW'));
                  this.router.navigate(['/dashboard/course-detail/'+resp?.code+'/'+resp?.openedCourseRecords[0].slug],
                  {skipLocationChange:false});

                });
              }
        } else {
            this.courseForm.markAllAsTouched();
          }
     }

     createFormObject(){
      const openedCourseTeacher=[{
        userId:this.userId,
        isActive:false,

      }]

      const openedCourses = (this.openedCourseRecords.value as any[]).filter(c => c.title);
   
        const formData = new FormData();
        formData.append('id', this.course ? this.course?.id :0);
        formData.append('code', this.course ? this.course?.code :'');
        formData.append('courseId', this.course ? this.course?.courseId:'0');
        formData.append('openedCourseTypeId', this.courseForm.get('openedCourseTypeId').value);
        formData.append('isConfirmed', this.courseForm.get('isConfirmed').value ? this.courseForm.get('isConfirmed').value: false);
        formData.append('isPopuler', this.courseForm.get('isPopuler').value ? this.courseForm.get('isPopuler').value: false);
        formData.append('isPublish', this.courseForm.get('isPublish').value ? this.courseForm.get('isPublish').value: false);
        formData.append('isRecommend', this.courseForm.get('isRecommend').value ? this.courseForm.get('isRecommend').value: false);
        formData.append('courseQuota', this.courseForm.get('courseQuota').value);
        formData.append('formFile', this.courseForm.get('fileSource').value);
        formData.append('StringCourseRecords', JSON.stringify(openedCourses));
        formData.append('StringCourseTeachers', JSON.stringify(openedCourseTeacher));

        return formData;
       
     }
}