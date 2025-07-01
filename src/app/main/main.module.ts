import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharecomponentModule } from '../sharecomponent/sharecomponent.module';
import { LayoutComponent } from './layout/layout.component';
import { PlanTaskComponent } from './plan-task/plan-task.component';
import { EndOfDayReporComponent } from './end-of-day-repor/end-of-day-repor.component';
import { ProfileComponent } from './profile/profile.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { CheckUserService } from '../services/user-role/check-user.service';
import { UserService } from '../services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyReportComponent } from './my-report/my-report.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    PlanTaskComponent,
    EndOfDayReporComponent,
    ProfileComponent,
    UserManagementComponent,
    AllReportsComponent,
    ComplianceComponent,
    MyReportComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharecomponentModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [LayoutComponent],
  providers: [CheckUserService, UserService],
})
export class MainModule {

}
