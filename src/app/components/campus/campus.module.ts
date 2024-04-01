import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { CampusListComponent } from './campus-list/campus-list.component';
import { CampusRoutingModule } from './campus.routing';
import { MatTableModule } from '@angular/material/table';
import { ManageCampusComponent } from './manage-campus/manage-campus.component';
import { CampusDetailResolverService } from './campus-detail-resolver';
import { AcademicUnitListComponent } from './academicunits/academicunit-list/academicunit-list.component';
import { ManageAcademicUnitComponent } from './academicunits/manage-academicunit/manage-academicunit.component';
import { AcademicUnitDetailResolverService } from './academicunits/academicunit-detail-resolver';
import { BuildingListComponent } from './buildings/building-list/building-list.component';
import { BuildingDetailResolverService } from './buildings/building-detail-resolver';
import { ManageBuildingComponent } from './buildings/manage-building/manage-building.component';
import { ClassroomListComponent } from './classrooms/classroom-list/classroom-list.component';
import { ManageClassroomComponent } from './classrooms/manage-classroom/manage-classroom.component';
import { ClassroomDetailResolverService } from './classrooms/classroom-detail-resolver';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        CampusRoutingModule,
        MatTableModule

    ],
    exports: [],
    declarations: [
        CampusListComponent,
        ManageCampusComponent,
        AcademicUnitListComponent,
        ManageAcademicUnitComponent,
        BuildingListComponent,
        ManageBuildingComponent,
        ClassroomListComponent,
        ManageClassroomComponent
    ],
    providers: [
        CampusDetailResolverService,
        AcademicUnitDetailResolverService,
        BuildingDetailResolverService,
        ClassroomDetailResolverService
    ],
})
export class CampusModule { }
