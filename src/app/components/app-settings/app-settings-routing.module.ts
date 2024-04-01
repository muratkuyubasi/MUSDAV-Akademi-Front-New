import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSettingsListComponent } from './app-settings-list/app-settings-list.component';
import { AppSettingsComponent } from './app-settings.component';

const routes: Routes = [{
  path: '',
  component: AppSettingsComponent,
  children: [
    {
      path: '',
      component: AppSettingsListComponent,
      data: { claimType: 'app_settings_list' },
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppSettingsRoutingModule { }
