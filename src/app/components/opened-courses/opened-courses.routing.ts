import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { OpenedCourseListComponent } from './courses/course-list/course-list.component';
import { ManageOpenedCourseComponent } from './courses/manage-course/manage-course.component';
import { OpenedCourseDetailResolverService } from './courses/manage-course/opened-course-detail-resolver';
import { LessonDetailComponent } from './lesson/lesson-detail.component';
import { LessonDetailResolverService } from './lesson/opened-course-detail-resolver';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';


export const routes: Routes = [
    {
        path: '',
        component: OpenedCourseListComponent,
        data: { claimType: 'opened_course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-opened-course/:openedCourseId',
        component:ManageOpenedCourseComponent,
        resolve: { course: OpenedCourseDetailResolverService },
        data: { claimType: 'opened_course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'manage-opened-course',
        component:ManageOpenedCourseComponent,
        data: { claimType: 'opened_course_list' },
        canActivate: [AuthGuard]
    },
    {
        path:'lessons/:sectionCode',
        component:LessonListComponent,
        data: { claimType: 'opened_course_list' },
        canActivate:[AuthGuard]
    },
    {
        path:'manage-lesson/:lessonId',
        component:LessonDetailComponent,
        resolve: { lesson: LessonDetailResolverService },
        data: { claimType: 'opened_course_list' },
        canActivate: [AuthGuard]
    },
   
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class OpenedCoursesRoutingModule { }