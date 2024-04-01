import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrolledCoursesComponent } from './dashboard/enrolled-courses/enrolled-courses.component';
import { WishlistComponent } from './dashboard/wishlist/wishlist.component';
import { MyProfileComponent } from '../user/my-profile/my-profile.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { ActiveCoursesComponent } from './dashboard/active-courses/active-courses.component';
import { OrdersListComponent } from './dashboard/orders-list/orders-list.component';
import { ReviewsComponent } from './dashboard/reviews/reviews.component';
import { CompletedCoursesComponent } from './dashboard/completed-courses/completed-courses.component';
import { CartComponent } from './dashboard/cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { InstructorsPageComponent } from './pages/instructors-page/instructors-page.component';
import { InstructorProfilePageComponent } from './pages/instructor-profile-page/instructor-profile-page.component';
import { SuccessStoriesPageComponent } from './pages/success-stories-page/success-stories-page.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { CoursesGridPageComponent } from './pages/courses-grid-page/courses-grid-page.component';
import { CoursesListPageComponent } from './pages/courses-list-page/courses-list-page.component';
import { CourseDetailsPageComponent } from './pages/course-details-page/course-details-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { TestimonialsPageComponent } from './pages/testimonials-page/testimonials-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { ProfileAuthenticationPageComponent } from './pages/profile-authentication-page/profile-authentication-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { BlogGridPageComponent } from './pages/blog-grid-page/blog-grid-page.component';
import { BlogRightSidebarPageComponent } from './pages/blog-right-sidebar-page/blog-right-sidebar-page.component';
import { BlogDetailsPageComponent } from './pages/blog-details-page/blog-details-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { HomeDemoThreeComponent } from './pages/home-demo-three/home-demo-three.component';
import { CategoriesPageComponent } from './pages/events-page/categories-page.component';
import { CourseDetailsResolverService } from './pages/course-details-page/course-details-resolver';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { AuthGuard } from '@core/security/auth.guard';
import { SearchPageComponent } from './pages/search/search-page.component';
import { StudentCourseDetailPageComponent } from './pages/student/student-course-detail/student-course-detail-page.component';
import { StudentCourseDetailResolverService } from './pages/student/student-course-detail/student-course-detail-resolver';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';



const routes: Routes = [
    {
      path:'',
      component:MainPageComponent
    },
    {
      path: 'about', component: AboutPageComponent,
    },
    {path: 'instructors', component: InstructorsPageComponent},
    {path: 'instructor-profile', component: InstructorProfilePageComponent},
    {path: 'success-stories', component: SuccessStoriesPageComponent},
    {path: 'pricing', component: PricingPageComponent},
    {path: 'faq', component: FaqPageComponent},
    {path: 'course/:code/:slug', component: CourseDetailsPageComponent,
      resolve: { course: CourseDetailsResolverService },
      data: { claimType: 'opened_course_list', }
    },
    {path: 'courses/:slug', component: CoursesGridPageComponent},
    {path: 'search/:slug', component: SearchPageComponent},
    {path: 'courses', component: CoursesGridPageComponent},
    {path: 'register-course/:code/:slug', component: RegisterStudentComponent,
      resolve: { course: CourseDetailsResolverService },
      // data: { claimType: 'opened_course_list' }
    },
    {path: 'register', component: RegisterComponent},
    {path: 'courses-list', component: CoursesListPageComponent},
    {path: 'course-detail/:code/:slug', component: StudentCourseDetailPageComponent,
      resolve: { studentCourse: StudentCourseDetailResolverService },
      data: { claimType: 'opened_course_list' }
    },
    {path: 'categories', component: CategoriesPageComponent},
    {path: 'event-details', component: EventDetailsPageComponent},
    {path: 'testimonials', component: TestimonialsPageComponent},
    {path: 'privacy-policy', component: PrivacyPolicyPageComponent},
    {path: 'terms-conditions', component: TermsConditionsPageComponent},
    {path: 'profile-authentication', component: ProfileAuthenticationPageComponent},
    {path: 'forgot-password', component: ForgotPasswordPageComponent},
    {path: 'blog-grid', component: BlogGridPageComponent},
    {path: 'blog-right-sidebar', component: BlogRightSidebarPageComponent},
    {path: 'blog-details', component: BlogDetailsPageComponent},
    {path: 'contact', component: ContactPageComponent},
    {path: 'resetpassword/:tokenx/:tokeny/:tokenz/:tokenf/:tokens', component: ResetPasswordComponent},
    {
      path:'dashboard', 
      canActivate:[AuthGuard],
      loadChildren: () =>
        import('./dashboard/dashboard.module')
          .then(m=>m.DashboardModule)
    },
    // {
    //   path: '**',
    //   redirectTo: '/'
    // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
