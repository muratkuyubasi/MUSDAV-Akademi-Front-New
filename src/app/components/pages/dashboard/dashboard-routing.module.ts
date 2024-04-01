import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

import { DashboardComponent } from './dashboard.component';
import { WebAnalyticsComponent } from '../../charts/web-analytics/web-analytics.component';

const routes: Routes = [
  {
    path: '',
    data: { claimType: 'dashboard_list' },
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path:'analytics',
    component:WebAnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
