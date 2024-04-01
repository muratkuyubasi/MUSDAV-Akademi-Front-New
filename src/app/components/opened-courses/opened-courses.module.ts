import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { OpenedCoursesRoutingModule } from './opened-courses.routing';
import {NgPipesModule} from 'ngx-pipes';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OpenedCourseListComponent } from './courses/course-list/course-list.component';
import { OpenedCourseDetailResolverService } from './courses/manage-course/opened-course-detail-resolver';
import { ManageOpenedCourseComponent } from './courses/manage-course/manage-course.component';
import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ManageSynchronCourseDetailComponent } from './lesson/manage-synchron/manage-synchron.component';
import { ManageASynchronCourseDetailComponent } from './lesson/manage-asynchron/manage-asynchron.component';
import { ManageFacetoFaceCourseDetailComponent } from './lesson/manage-facetoface/manage-facetoface.component';

import { MaterialModule } from '@shared/material.module';
import { VimeoUploadComponent } from '@shared/vimeo/vimeo-upload/vimeo-upload.component';
import { VimeoPlayerComponent } from '@shared/vimeo/vimeo-player/vimeo-player.component';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { PlyrModule } from 'ngx-plyr';
import { StudentListComponent } from './courses/student/student-list.component';
import { AddStudentComponent } from './courses/student/add-student/add-student.component';
import { LessonDetailComponent } from './lesson/lesson-detail.component';
import { LessonDetailResolverService } from './lesson/opened-course-detail-resolver';
import { ManageSectionComponent } from './courses/manage-section/manage-section.component';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';
import { ManageBranchComponent } from './courses/manage-branch/manage-branch.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        NgPipesModule,
        OpenedCoursesRoutingModule,
        MaterialModule,
        NgxEditorModule,
        CKEditorModule,
        PlyrModule
 

    ],
    exports: [],
    declarations: [
        OpenedCourseListComponent,
        ManageOpenedCourseComponent,
        ManageSynchronCourseDetailComponent,
        ManageASynchronCourseDetailComponent,
        ManageFacetoFaceCourseDetailComponent,
        ManageSectionComponent,
        StudentListComponent,
        LessonDetailComponent,
        LessonListComponent,
        ManageBranchComponent,
        AddStudentComponent,
        VimeoUploadComponent,
        VimeoPlayerComponent
    ],
    providers: [
        OpenedCourseDetailResolverService,
        LessonDetailResolverService,
        VimeoUploadService
    ],
})
export class OpenedCoursesModule { }
