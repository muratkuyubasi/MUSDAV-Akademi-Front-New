import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CourseRoutingModule } from './course.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CourseListComponent } from './course-list/course-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { CourseDetailResolverService } from './course-detail-resolver';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { NgxEditorModule } from 'ngx-editor';
import {MatExpansionModule} from '@angular/material/expansion';
import { VimeoUploadComponent } from './manage-course/vimeo-upload/vimeo-upload.component';
import { VimeoUploadService } from './vimeo-upload-service';
import { VimeoPlayerComponent } from './manage-course/vimeo-player/vimeo-player.component';
import { PlyrModule } from 'ngx-plyr';
import { ManageLessonComponent } from './manage-lesson/manage-lesson.component';

@NgModule({
    imports: [
        CommonModule,
        CourseRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatButtonModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        NgxEditorModule,
        MatExpansionModule,
        NgxEditorModule,
        PlyrModule
    ],
    exports: [],
    declarations: [CourseListComponent,ManageCourseComponent,VimeoUploadComponent, VimeoPlayerComponent,ManageLessonComponent],
    providers: [CourseDetailResolverService,VimeoUploadService],
})
export class CourseModule { }
