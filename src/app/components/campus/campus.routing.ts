import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

import { CampusListComponent } from './campus-list/campus-list.component';
import { ManageCampusComponent } from './manage-campus/manage-campus.component';
import { CampusDetailResolverService } from './campus-detail-resolver';
import { AcademicUnitListComponent } from './academicunits/academicunit-list/academicunit-list.component';
import { ManageAcademicUnitComponent } from './academicunits/manage-academicunit/manage-academicunit.component';
import { AcademicUnitDetailResolverService } from './academicunits/academicunit-detail-resolver';
import { BuildingListComponent } from './buildings/building-list/building-list.component';
import { ManageBuildingComponent } from './buildings/manage-building/manage-building.component';
import { BuildingDetailResolverService } from './buildings/building-detail-resolver';
import { ClassroomDetailResolverService } from './classrooms/classroom-detail-resolver';
import { ClassroomListComponent } from './classrooms/classroom-list/classroom-list.component';
import { ManageClassroomComponent } from './classrooms/manage-classroom/manage-classroom.component';


export const routes: Routes = [
    {
        path: '',
        component: CampusListComponent,
        data: { claimType: 'campus_list' },
        canActivate: [AuthGuard]
    },
    {
        path: 'manage/:campusId',
        component: ManageCampusComponent,
        resolve: { campus: CampusDetailResolverService },
        data: { claimType: 'campus_edit' },
        canActivate: [AuthGuard]
      }, 
      {
        path: 'manage',
        component: ManageCampusComponent,
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      }, 
      {
        path:'academicunits/:campusId',
        component: AcademicUnitListComponent,
        resolve: { campus: CampusDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-academicunit/:campusId',
        component:ManageAcademicUnitComponent,
        resolve: { campus: CampusDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-academicunit/:campusId/:academicUnitId',
        component:ManageAcademicUnitComponent,
        resolve: {
          academicUnit:AcademicUnitDetailResolverService ,
           campus: CampusDetailResolverService
          },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'buildings/:academicUnitId',
        component: BuildingListComponent,
        resolve: { academicUnit: AcademicUnitDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-building/:academicUnitId',
        component:ManageBuildingComponent,
        resolve: { academicUnit: AcademicUnitDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-building/:academicUnitId/:buildingId',
        component:ManageBuildingComponent,
        resolve: {
            building:BuildingDetailResolverService ,
            academicUnit: AcademicUnitDetailResolverService
          },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'classrooms/:buildingId',
        component: ClassroomListComponent,
        resolve: { building: BuildingDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-classroom/:buildingId',
        component:ManageClassroomComponent,
        resolve: { building: BuildingDetailResolverService },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      {
        path:'manage-classroom/:buildingId/:classroomId',
        component:ManageClassroomComponent,
        resolve: {
            building:BuildingDetailResolverService ,
            classroom: ClassroomDetailResolverService
          },
        data: { claimType: 'campus_add' },
        canActivate: [AuthGuard]
      },
      
]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class CampusRoutingModule { }