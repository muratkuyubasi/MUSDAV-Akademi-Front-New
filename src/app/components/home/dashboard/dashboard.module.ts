import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrolledCoursesComponent } from './enrolled-courses/enrolled-courses.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { SlugifyPipe } from '@shared/pipes/slugify.pipe';
import { ManageInstructorComponent } from './instructor/manage/manage-instructor.component';
import { SharedModule } from '@shared/shared.module';
import { InstructorComponent } from './instructor/instructor.component';
import { CourseListComponent } from './instructor/course-list/course-list.component';
import { InstructorCourseDetailComponent } from './instructor/course-detail/course-detail.component';
import { InsCourseDetailsResolverService } from './instructor/course-detail/ins-course-details-resolver';
import { CourseSectionComponent } from './instructor/course-section/course-section.component';
import { InstructorCourseRecordComponent } from './instructor/course-record/course-record.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InstructorCourseLessonsComponent } from './instructor/course-lessons/course-lessons.component';
import { ManageInsASynchronCourseDetailComponent } from './instructor/course-lessons/manage-asynchron/manage-asynchron.component';
import { PlyrModule } from 'ngx-plyr';
import { InstructorVimeoUploadComponent } from './vimeo/vimeo-upload/vimeo-upload.component';
import { InstructorVimeoPlayerComponent } from './vimeo/vimeo-player/vimeo-player.component';
import { MatTableModule } from '@angular/material/table';
import { VimeoService } from './vimeo/vimeo-service';
import { InstructorCourseFileComponent } from './instructor/course-file/course-file.component';
import { InstructorCourseQuestionsComponent } from './instructor/course-questions/course-questions.component';
import { InstructorCourseStudentsComponent } from './instructor/course-students/course-students.component';
import { ManageInsSynchronCourseDetailComponent } from './instructor/course-lessons/manage-synchron/manage-synchron.component';
import { GetOfferComponent } from './offers/get-offers/get-offer.component';
import { GiveOfferComponent } from './offers/give-offers/give-offer.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ManageExamComponent } from './exam/manage-exam/manage-exam.component';
import { ExamDetailsResolverService } from './exam/exam-detail.resolver';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { QuestionListComponent } from './exam/question-list/question-list.component';
import { ManageQuestionComponent } from './exam/manage-question/manage-question.component';
import { MultipleChoiceComponent } from './exam/manage-question/multiple-choice/multiple-choice.component';
import { QuestionDetailComponent } from './exam/detail-question/detail-question.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        SharedModule,
        CKEditorModule,
        PlyrModule,
        MatTableModule,
        AutocompleteLibModule,
        NgxMaskModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        JsonPipe,
        MatNativeDateModule,
        AngularEditorModule
        
    ],
    exports: [],
    declarations: [
        DashboardComponent,
        EnrolledCoursesComponent,
        MyProfileComponent,
        ReviewsComponent,
        OrdersListComponent,
        ManageInstructorComponent,
        InstructorComponent,
        CourseListComponent,
        InstructorCourseDetailComponent,
        CourseSectionComponent,
        InstructorCourseRecordComponent,
        InstructorCourseLessonsComponent,
        ManageInsASynchronCourseDetailComponent,
        ManageInsSynchronCourseDetailComponent,
        InstructorVimeoUploadComponent,
        InstructorVimeoPlayerComponent,
        InstructorCourseFileComponent,
        InstructorCourseQuestionsComponent,
        InstructorCourseStudentsComponent,
        GetOfferComponent,
        GiveOfferComponent,
        CartComponent,
        CheckoutComponent,
        ExamListComponent,
        ManageExamComponent,
        QuestionListComponent,
        ManageQuestionComponent,
        QuestionDetailComponent,
        MultipleChoiceComponent
        
        ],
    providers: [InsCourseDetailsResolverService,VimeoService,ExamDetailsResolverService],
})
export class DashboardModule { }
