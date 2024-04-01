import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { RoleDetailResolverService } from './role-detail.resolver';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleUsersComponent } from './role-users/role-users.component';

const routes: Routes = [
  {
    path: '',
    component: RoleListComponent,
    data: { claimType: 'role_list' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: ManageRoleComponent,
    resolve: { role: RoleDetailResolverService },
    data: { claimType: 'role_edit' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage',
    component: ManageRoleComponent,
    data: { claimType: 'role_add' },
    canActivate: [AuthGuard]
  }, {
    path: 'users',
    component: RoleUsersComponent,
    data: { claimType: 'user_role_edit' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
