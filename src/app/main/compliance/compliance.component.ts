import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICompliance } from 'src/app/helper/interface/Icomplince';
import { AdminService } from 'src/app/services/admin/user/admin.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss'],
})
export class ComplianceComponent implements OnInit {
  @ViewChild('date') date!: ElementRef;
  @ViewChild('checkMissingReports') checkMissingReports!: ElementRef;
  totalEmployee: number = 0;
  submitReports: number = 0;
  missingReports: number = 0;
  displayReports: ICompliance[] = [];
  curentDate = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.adminService.getAllUser().subscribe({
      next: (user) => {
        const missingCheck = this.checkMissingReports.nativeElement.checked;
        this.totalEmployee = user.length;
        const date = this.date.nativeElement.value
          .split('-')
          .reverse()
          .map((val: any) => {
            if (val.length <= 2) {
              val = val.startsWith('0') ? val[1] : val;
            }
            return val;
          })
          .join('/');
        this.adminService.getPlanTaskReport(date).subscribe({
          next: (plan) => {
            this.adminService.getEodReport(date).subscribe({
              next: (eod) => {
                this.displayReports = user.map((val) => {
                  const report = plan.find(
                    (report) => report.userId === val.id
                  );
                  const eodReport = eod.find(
                    (report) => report.userId === val.id
                  );
                  let newReport;
                  if (report && eodReport) {
                    const date = new Date(eodReport.createdAt).toLocaleString();
                    newReport = {
                      name: val.name,
                      email: val.email,
                      department: val.department,
                      status: 'Submitted',
                      workingHours: eodReport.workingHours + 'h' || '-',
                      tasksCompleted: report.tasks.length + '',
                      submissionTime: date + '',
                    };
                  } else {
                    newReport = {
                      name: val.name,
                      email: val.email,
                      department: val.department,
                      status: 'Missing',
                      workingHours: '-',
                      tasksCompleted: '-',
                      submissionTime: '-',
                    };
                  }
                  return newReport;
                });
                this.missingReports = this.displayReports.filter(
                  (val) => val.status === 'Missing'
                ).length;
                this.submitReports = this.displayReports.filter(
                  (val) => val.status === 'Submitted'
                ).length;
                this.displayReports = this.displayReports.filter((val) => {
                  return val && missingCheck ? val.status === 'Missing' : true;
                });
              },
            });
          },
        });
      },
      error: () => {},
    });
  }

  downloadCsvFile() {
    const data = this.displayReports;

    let csvContent = 'data:text/csv;charset=utf-8,';

    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + '\n';

    data.forEach(function (row: any) {
      let rowData = headers
        .map((header) => {
          const value = String(row[header]);
          return value.includes(',') ? `"${value}"` : value;
        })
        .join(',');
      csvContent += rowData + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'my_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
