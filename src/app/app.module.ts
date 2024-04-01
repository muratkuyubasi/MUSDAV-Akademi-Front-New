import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AppMessageComponent } from './components/pages/app-message/app-message.component';
import { AppEmailComponent } from './components/pages/app-email/app-email.component';
import { AppEmailReadComponent } from './components/pages/app-email-read/app-email-read.component';
import { AppEmailComposeComponent } from './components/pages/app-email-compose/app-email-compose.component';
import { AppTodoComponent } from './components/pages/app-todo/app-todo.component';
import { AppCalendarComponent } from './components/pages/app-calendar/app-calendar.component';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { InvoiceComponent } from './components/pages/invoice/invoice.component';
import { ReviewsComponent } from './components/pages/reviews/reviews.component';
import { MyListingComponent } from './components/pages/my-listing/my-listing.component';
import { BookmarksComponent } from './components/pages/bookmarks/bookmarks.component';
import { BookingsComponent } from './components/pages/bookings/bookings.component';
import { WebAnalyticsComponent } from './components/charts/web-analytics/web-analytics.component';
import { AddListingComponent } from './components/pages/add-listing/add-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorModule } from './http-interceptor.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './translater-loader';
import { AppStoreModule } from './store/app-store.module';
import { PendingInterceptorModule } from '@shared/loading-indicator/pending-interceptor.module';
import { ToastrModule } from 'ngx-toastr';
import {NgxMaskModule} from 'ngx-mask'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    AppComponent,
    // DashboardComponent,
    // AppMessageComponent,
    // AppEmailComponent,
    // AppEmailReadComponent,
    // AppEmailComposeComponent,
    // AppTodoComponent,
    // AppCalendarComponent,
    // MyProfileComponent,
    // InvoiceComponent,
    // ReviewsComponent,
    // MyListingComponent,
    // BookmarksComponent,
    // BookingsComponent,
    // WebAnalyticsComponent,
    // AddListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpInterceptorModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:(createTranslateLoader),
        deps:[HttpClient]
      }
    }),
    AppStoreModule,
    PendingInterceptorModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot({
      showMaskTyped:true
    }),
    CKEditorModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
