import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { AppSettingsComponent } from './app-settings.component';
import { AppSettingsListComponent } from './app-settings-list/app-settings-list.component';
import { AppSettingsManageComponent } from './app-settings-manage/app-settings-manage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AppSettingsComponent,
    AppSettingsListComponent,
    AppSettingsManageComponent],
  imports: [
    CommonModule,
    AppSettingsRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    SharedModule
  ]
})
export class AppSettingsModule { }
