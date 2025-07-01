import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { PlanTaskComponent } from './plan-task/plan-task.component';
import { EndOfDayReporComponent } from './end-of-day-repor/end-of-day-repor.component';
import { ProfileComponent } from './profile/profile.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { childGuardGuard } from '../guard/child-guard/child-guard.guard';
import { MyReportComponent } from './my-report/my-report.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: '',
        canActivateChild: [childGuardGuard],
         data: { animation: 'HomePage' } ,
        children: [
          { path: 'plan-task', component: PlanTaskComponent , data: { animation: 'HomePage' } },
          { path: 'user-management', component: UserManagementComponent,  data: { animation: 'HomePage' }  },
          { path: 'all-reports', component: AllReportsComponent , data: { animation: 'HomePage' } },
          { path: 'compliance', component: ComplianceComponent, data: { animation: 'HomePage' }  },
          { path: 'report', component: EndOfDayReporComponent, data: { animation: 'HomePage' }  },
          { path: 'my-report', component: MyReportComponent, data: { animation: 'HomePage' }  },
          // { path: '**', pathMatch: 'full', redirectTo: 'dashboard' },
          { path: '**', redirectTo: 'dashboard' },
        ],
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
