import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './components/user/my-profile/my-profile.component';
import { AppEmailComponent } from './components/pages/app-email/app-email.component';
import { AppMessageComponent } from './components/pages/app-message/app-message.component';
import { AppEmailReadComponent } from './components/pages/app-email-read/app-email-read.component';
import { AppEmailComposeComponent } from './components/pages/app-email-compose/app-email-compose.component';
import { AppTodoComponent } from './components/pages/app-todo/app-todo.component';
import { AppCalendarComponent } from './components/pages/app-calendar/app-calendar.component';
// import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { InvoiceComponent } from './components/pages/invoice/invoice.component';
import { ReviewsComponent } from './components/pages/reviews/reviews.component';
import { MyListingComponent } from './components/pages/my-listing/my-listing.component';
import { BookmarksComponent } from './components/pages/bookmarks/bookmarks.component';
import { BookingsComponent } from './components/pages/bookings/bookings.component';
import { AddListingComponent } from './components/pages/add-listing/add-listing.component';
import { LayoutComponent } from '@core/layout/layout.component';
import { AuthGuard } from '@core/security/auth.guard';
import { HomeLayoutComponent } from '@core/home-layout/home-layout.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () =>
          import('./components/login/login.module')
            .then(m => m.LoginModule)
      },
      // {path: 'add', component: AddListingComponent},
      {
        path:'',
        component:HomeLayoutComponent,
        children:[
          {
            path:'',
            loadChildren:()=>import('./components/home/home.component.module').then(m=>m.HomeModule)
          }
        ]
      },
      {
        path:'admin',
        component:LayoutComponent,
        children:[
          {
            path: '',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/dashboard/dashboard.module')
                .then(m => m.DashboardModule)
          }, 
          {
            path:'campuses',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/campus/campus.module').then(m=>m.CampusModule)
          }, 
          {
            path:'courses',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/main-courses/main-courses.module').then(m=>m.MainCoursesModule)
          },
          {
            path:'opened-courses',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/opened-courses/opened-courses.module').then(m=>m.OpenedCoursesModule)
          },
          {
            path:'course',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/course/course.module').then(m=>m.CourseModule)
          },
          {
            path:'offers',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/offers/offers.module').then(m=>m.OfferModule)
          },
          {
            path:'video-book',
            canLoad:[AuthGuard],
            loadChildren:()=>
              import('./components/video-book/video-book.module').then(m=>m.VideoBookModule)
          },
          {
            path: 'my-profile',
            component: MyProfileComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'actions',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/action/action.module')
                .then(m => m.ActionModule)
          }, 
          {
            path: 'pages',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/page/page.module')
                .then(m => m.PageModule)
          }, 
          {
            path: 'page-action',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/page-action/page-action.module')
                .then(m => m.PageActionModule)
          },
          {
            path: 'roles',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/role/role.module')
                .then(m => m.RoleModule)
          }, {
            path: 'users',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/user/user.module')
                .then(m => m.UserModule)
          }, {
            path: 'login-audit',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/login-audit/login-audit.module')
                .then(m => m.LoginAuditModule)
          },
          {
            path: 'sessions',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/session/session.module')
                .then(m => m.SessionModule)
          },
          {
            path: 'appsettings',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/app-settings/app-settings.module')
                .then(m => m.AppSettingsModule)
          },
          {
            path: 'email-template',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/email-template/email-template.module')
                .then(m => m.EmailTemplateModule)
          },
          {
            path: 'send-email',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/email-send/email-send.module')
                .then(m => m.EmailSendModule)
          },
          {
            path: 'logs',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/n-log/n-log.module')
                .then(m => m.NLogModule)
          },
          {
            path: 'email-smtp',
            canLoad: [AuthGuard],
            loadChildren: () =>
              import('./components/email-smtp-setting/email-smtp-setting.module')
                .then(m => m.EmailSmtpSettingModule)
          },
          {path: 'add', component: AddListingComponent},
          {path: 'app-message', component: AppMessageComponent},
          {path: 'app-email', component: AppEmailComponent},
          {path: 'app-email-read', component: AppEmailReadComponent},
          {path: 'app-email-compose', component: AppEmailComposeComponent},
          {path: 'app-todo', component: AppTodoComponent},
          {path: 'app-calendar', component: AppCalendarComponent},
          // {path: 'my-profile', component: MyProfileComponent},
          {path: 'invoice', component: InvoiceComponent},
          {path: 'reviews', component: ReviewsComponent},
          {path: 'my-listing', component: MyListingComponent},
          {path: 'add-listing', component: AddListingComponent},
          {path: 'bookmarks', component: BookmarksComponent},
          {path: 'bookings', component: BookingsComponent},
          {
            path: '**',
            redirectTo: '/'
          },
        ]
      },

    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}