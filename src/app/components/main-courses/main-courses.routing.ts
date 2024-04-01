import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { CategoryListComponent } from './categories/category-list/category-list.component';
import { CategoryDetailResolverService } from './categories/manage-category/category-detail-resolver';
import { ManageCategoryComponent } from './categories/manage-category/manage-category.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { ManageCourseComponent } from './courses/manage-course/manage-course.component';
import { CourseDetailResolverService } from './courses/manage-course/course-detail-resolver';

export const routes: Routes = [
    {
        path: '',
        component: CourseListComponent,
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-course/:courseId',
        component:ManageCourseComponent,
        resolve: { course: CourseDetailResolverService },
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-course',
        component:ManageCourseComponent,
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'categories',
        component:CategoryListComponent,
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-category/:categoryId',
        component:ManageCategoryComponent,
        resolve: { category: CategoryDetailResolverService },
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-category',
        component:ManageCategoryComponent,
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class MainCoursesRoutingModule { }