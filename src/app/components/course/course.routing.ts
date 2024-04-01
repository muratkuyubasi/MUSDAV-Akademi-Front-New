import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { CourseDetailResolverService } from './course-detail-resolver';
import { VimeoPlayerComponent } from './manage-course/vimeo-player/vimeo-player.component';
import { ManageLessonComponent } from './manage-lesson/manage-lesson.component';

export const routes: Routes = [
    {
        path: '',
        component: CourseListComponent,
        data: { claimType: 'course_list' },
        canActivate: [AuthGuard]
    },
    {
      path: 'manage/:id',
      component: ManageCourseComponent,
      resolve: { course: CourseDetailResolverService },
      data: { claimType: 'course_edit' },
      canActivate: [AuthGuard]
    }, 
    {
      path: 'manage',
      component: ManageCourseComponent,
      data: { claimType: 'course_add' },
      canActivate: [AuthGuard]
    }, 
    {
      path: 'manage-section/:sectionId/:lessonId',
      component: ManageLessonComponent,
      data: { claimType: 'course_add' },
      canActivate: [AuthGuard]
    }, 
    {
      path: 'manage-section/:sectionId',
      component: ManageLessonComponent,
      data: { claimType: 'course_add' },
      canActivate: [AuthGuard]
    }, 
    {
      path:'player',
      component:VimeoPlayerComponent
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CourseRoutingModule { }