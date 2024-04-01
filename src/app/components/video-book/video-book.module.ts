import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared/shared.module';
import { VideoBookListComponent } from './video-book-list/video-book-list.component';
import { VideoBookRoutingModule } from './video-book-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { ManageVideoBookComponent } from './manage-video-book/manage-video-book.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PlyrModule } from 'ngx-plyr';
// import { VimeoUploadComponent } from './vimeo-upload/vimeo-upload.component';
// import { VimeoUploadService } from './vimeo-upload/vimeo-upload.service';
import { SafePipe } from '../../safe.pipe';
import { VideoBookDetailResolverService } from './video-book-detail-resolver';
import { TranslateModule } from '@ngx-translate/core';
import { ManageVideoComponent } from './manage-video-book/manage-video/manage-video.component';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';
import { ReadingHistoryComponent } from './reading-history/reading-history.component';

@NgModule({
  declarations: [
    VideoBookListComponent,
    ManageVideoBookComponent,
    ManageVideoComponent,
    ManagePermissionComponent,
    VideoUploadComponent,
    ReadingHistoryComponent,
    // VimeoUploadComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    VideoBookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    FileUploadModule,
    PlyrModule,
    TranslateModule
  ],
  providers:[
    VideoBookDetailResolverService,
    SafePipe
  ]

})
export class VideoBookModule { }
