import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MainCoursesRoutingModule } from './main-courses.routing';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryDetailResolverService } from './categories/manage-category/category-detail-resolver';
import { ManageCategoryComponent } from './categories/manage-category/manage-category.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailResolverService } from './courses/manage-course/course-detail-resolver';
import { ManageCourseComponent } from './courses/manage-course/manage-course.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        MainCoursesRoutingModule,
        MatTableModule,
        MatSlideToggleModule

    ],
    exports: [],
    declarations: [
      CategoryListComponent,
      ManageCategoryComponent,
      CourseListComponent,
      ManageCourseComponent
    ],
    providers: [
       CategoryDetailResolverService,
       CourseDetailResolverService
    ],
})
export class MainCoursesModule { }
