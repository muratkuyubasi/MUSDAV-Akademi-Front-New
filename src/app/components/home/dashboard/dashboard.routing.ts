
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { EnrolledCoursesComponent } from './enrolled-courses/enrolled-courses.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ManageInstructorComponent } from './instructor/manage/manage-instructor.component';
import { AuthGuard } from '@core/security/auth.guard';
import { InstructorComponent } from './instructor/instructor.component';
import { CourseListComponent } from './instructor/course-list/course-list.component';
import { InstructorCourseDetailComponent } from './instructor/course-detail/course-detail.component';
import { InsCourseDetailsResolverService } from './instructor/course-detail/ins-course-details-resolver';
import { InstructorCourseLessonsComponent } from './instructor/course-lessons/course-lessons.component';
import { GetOfferComponent } from './offers/get-offers/get-offer.component';
import { GiveOfferComponent } from './offers/give-offers/give-offer.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ManageExamComponent } from './exam/manage-exam/manage-exam.component';
import { ExamDetailsResolverService } from './exam/exam-detail.resolver';
import { QuestionListComponent } from './exam/question-list/question-list.component';
import { ManageQuestionComponent } from './exam/manage-question/manage-question.component';
import { QuestionDetailComponent } from './exam/detail-question/detail-question.component';


const routes: Routes = [{
    path:'', 
    component:DashboardComponent,
    children: [
      { path: 'enrolled-courses', component: EnrolledCoursesComponent,
        data: { claimType: 'student_list' },
        canActivate: [AuthGuard]
      },
      { path: 'instructor-manage/:id', component:ManageInstructorComponent},
      { path: 'instructor-manage', component:ManageInstructorComponent,
        data: { claimType: 'student_list' },
        canActivate: [AuthGuard]
      },
      { path: 'my-profile', component: MyProfileComponent },

      { path: 'orders-list', component: OrdersListComponent,
        data: { claimType: 'student_list' },
        canActivate: [AuthGuard] 
      },
      { path: 'reviews', component: ReviewsComponent,
        data: { claimType: 'student_list' },
        canActivate: [AuthGuard] 
      },
      {
        path:'courses', component:CourseListComponent,
        data: { claimType: 'instructor_list' },
        canActivate: [AuthGuard]
      },
      {
        path:'course-detail/:code/:slug', 
        component:InstructorCourseDetailComponent,
        resolve: { course: InsCourseDetailsResolverService },
        data: { claimType: 'instructor_list' },
        canActivate: [AuthGuard]
      },
      {
        path:'course-detail', component:InstructorCourseDetailComponent,
        data: { claimType: 'instructor_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'course-lessons/:sectionCode', component:InstructorCourseLessonsComponent,
        data: { claimType: 'instructor_list' },
        canActivate: [AuthGuard]
      },
      {
        path:'get-offer',
        data:{ claimType:'get-offer'},
        component:GetOfferComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'give-offer',
        data:{ claimType:'give-offer'},
        component:GiveOfferComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'exams',
        data: { claimType: 'exam_list' },
        component:ExamListComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'manage-exam/:code',
        data: { claimType: 'exam_edit' },
        resolve: { exam: ExamDetailsResolverService },
        component:ManageExamComponent
      },
      {
        path:'manage-exam',
        data: { claimType: 'exam_add' },
        component:ManageExamComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'question-list/:code',
        data: { claimType: 'exam_add' },
        component:QuestionListComponent,
        resolve: { exam: ExamDetailsResolverService },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-question/:code',
        data: { claimType: 'exam_edit' },
        resolve: { exam: ExamDetailsResolverService },
        component:ManageQuestionComponent
      },
      {
        path:'detail-question/:code',
        data: { claimType: 'exam_edit' },
        component:QuestionDetailComponent
      },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
    // {
    //   path: '**',
    //   pathMatch:'full',
    //   redirectTo: '/'
    // },
    //   { path: 'completed-courses', component: CompletedCoursesComponent },
    //   { path: 'cart', component: CartComponent }
     ]
  },]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DashboardRoutingModule {
    
   }