import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home.component.routing';
import { HomeComponent } from './home.component';
import { HomethreeBannerComponent } from './pages/home-demo-three/homethree-banner/homethree-banner.component';
import { CategoriesComponent } from './common/categories/categories.component';
import { FeaturedComponent } from './common/featured/featured.component';
import { FeaturedCoursesComponent } from './common/featured-courses/featured-courses.component';
import { AboutComponent } from './common/about/about.component';
import { FeaturedBoxesComponent } from './common/featured-boxes/featured-boxes.component';
import { VideoComponent } from './common/video/video.component';
import { FunfactsComponent } from './common/funfacts/funfacts.component';
import { CoursesComponent } from './common/courses/courses.component';
import { FeaturesComponent } from './common/features/features.component';
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
import { BlogComponent } from './common/blog/blog.component';
import { PartnerComponent } from './common/partner/partner.component';
import { SubscribeComponent } from './common/subscribe/subscribe.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { InstructorsComponent } from './common/instructors/instructors.component';
import { TopRatedCoursesComponent } from './common/top-rated-courses/top-rated-courses.component';
import { OverviewComponent } from './common/overview/overview.component';
import { BlogWidgetComponent } from './common/blog-widget/blog-widget.component';
import { EnrolledCoursesComponent } from './dashboard/enrolled-courses/enrolled-courses.component';
import { WishlistComponent } from './dashboard/wishlist/wishlist.component';
import { MyProfileComponent } from '../pages/my-profile/my-profile.component';
import { ActiveCoursesComponent } from './dashboard/active-courses/active-courses.component';
import { ReviewsComponent } from '../pages/reviews/reviews.component';
import { CompletedCoursesComponent } from './dashboard/completed-courses/completed-courses.component';
import { CartComponent } from './dashboard/cart/cart.component';
import { OrdersListComponent } from './dashboard/orders-list/orders-list.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { HomeDemoThreeComponent } from './pages/home-demo-three/home-demo-three.component';
import { CategoriesPageComponent } from './pages/events-page/categories-page.component';
import { SlugifyPipe } from '@shared/pipes/slugify.pipe';
import { AngularPaginatorModule } from 'angular-paginator';
import { CourseDetailsResolverService } from './pages/course-details-page/course-details-resolver';
import { NgPipesModule } from 'ngx-pipes';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPageComponent } from './pages/search/search-page.component';
import { StudentCourseDetailResolverService } from './pages/student/student-course-detail/student-course-detail-resolver';
import { StudentCourseDetailPageComponent } from './pages/student/student-course-detail/student-course-detail-page.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { VimeoPlayerComponent } from '@shared/vimeo/vimeo-player/vimeo-player.component';
import { CoreModule } from '@core/core.module';
import { PlyrModule } from 'ngx-plyr';
import { VimeoUploadService } from '@shared/vimeo/vimeo-upload-service';
import { RegisterComponent } from './pages/register/register.component';
import { HomePagesOfferComponent } from './common/offers/homepage-offers.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { StudentSynchronCourseComponent } from './pages/student/synchron-course/synchron-course.component';
import { StudentASynchronCourseComponent } from './pages/student/asynchron-course/asynchron-course.component';
import { StudentFaceToFaceCourseComponent } from './pages/student/face-to-face/facetoface-course.component';




@NgModule({
  declarations: [
    HomeComponent,
    SearchPageComponent,
    StudentCourseDetailPageComponent,
    HomeDemoThreeComponent,
    MainPageComponent,
    HomePagesOfferComponent,
    NotFoundComponent,
        BlogComponent,
        PartnerComponent,
        FeaturesComponent,
        SubscribeComponent,
        FeedbackComponent,
        InstructorsComponent,
        AboutComponent,
        FeaturedComponent,
        CategoriesComponent,
        CoursesComponent,
        FeaturedCoursesComponent,
        TopRatedCoursesComponent,
        FunfactsComponent,
        FeaturedBoxesComponent,
        OverviewComponent,
        VideoComponent,
        HomethreeBannerComponent,
        ContactPageComponent,
        AboutPageComponent,
        FaqPageComponent,
        PrivacyPolicyPageComponent,
        TermsConditionsPageComponent,
        ProfileAuthenticationPageComponent,
        TestimonialsPageComponent,
        ForgotPasswordPageComponent,
        InstructorsPageComponent,
        InstructorProfilePageComponent,
        SuccessStoriesPageComponent,
        PricingPageComponent,
        CategoriesPageComponent,
        EventDetailsPageComponent,
        BlogGridPageComponent,
        BlogRightSidebarPageComponent,
        BlogDetailsPageComponent,
        BlogWidgetComponent,
        CoursesGridPageComponent,
        CoursesListPageComponent,
        CourseDetailsPageComponent,        // DashboardComponent,
        // WishlistComponent,
        // MyProfileComponent,
        // ActiveCoursesComponent,
        // ReviewsComponent,
        // CompletedCoursesComponent,
         
        // OrdersListComponent,
        // EditProfileComponent,
        RegisterStudentComponent,
        SlugifyPipe,
        RegisterComponent,
        ResetPasswordComponent,
        StudentSynchronCourseComponent,
        StudentASynchronCourseComponent,
        StudentFaceToFaceCourseComponent
        // VirtualClassComponent
        
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    AngularPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    PlyrModule,
    NgxPaginationModule

    
  ],
  providers:[
    CourseDetailsResolverService,StudentCourseDetailResolverService,VimeoUploadService],
  exports:[
      
  ]
})
export class HomeModule { }
