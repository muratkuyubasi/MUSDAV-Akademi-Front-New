import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageVideoBookComponent } from './manage-video-book/manage-video-book.component';
import { VideoBookDetailResolverService } from './video-book-detail-resolver';
import { VideoBookListComponent } from './video-book-list/video-book-list.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';
// import { VimeoUploadComponent } from './vimeo-upload/vimeo-upload.component';

const routes: Routes = [
  {
    path: '',
    component: VideoBookListComponent,
    data: { claimType: 'video_books_list' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: ManageVideoBookComponent,
    resolve: { book: VideoBookDetailResolverService },
    data: { claimType: 'video_books_edit' },
    canActivate: [AuthGuard]
  }, 
  {
    path: 'manage',
    component: ManageVideoBookComponent,
    data: { claimType: 'video_books_add' },
    canActivate: [AuthGuard]
  }, 
  {
    path: 'upload/:id',
    component: VideoUploadComponent,
    resolve: { book: VideoBookDetailResolverService },
    data: { claimType: 'video_books_add' },
    canActivate: [AuthGuard]
  }, 
  // {
  //   path: 'vimeo-upload/:id',
  //   component: VimeoUploadComponent,
  //   resolve: { book: VideoBookDetailResolverService },
  //   data: { claimType: 'video_book_add' },
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoBookRoutingModule { }
