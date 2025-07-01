import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IEodReports } from 'src/app/helper/interface/IeodReport';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-end-of-day-repor',
  templateUrl: './end-of-day-repor.component.html',
  styleUrls: ['./end-of-day-repor.component.scss'],
})
export class EndOfDayReporComponent implements OnInit {
  eodReport!: IEodReports;
  editAlertShow: boolean = false;
  successAlertShow: boolean = false;
  dangerAlertShow: boolean = false;
  showUpdateList: boolean = false;
  editReport: boolean = true;
  message: string = 'Please add at least one task.';
  completedTasks: { value: string }[] = [];

  constructor(private userService: UserService) {
    this.userService.getEodReports().subscribe({
      next: (res) => {
        if (res.length >= 1) {
          this.userService.eodReport.next(res[0]);
        } else {
          this.userService.eodReport.next(this.userService.eodReports);
        }
      },
      error: () => {},
    });
  }

  ngOnInit() {
    this.userService.eodReport.subscribe((report) => {
      this.eodReport = report;
      this.editAlertShow = report.editCount >= 1;
      this.showUpdateList = report.editCount >= 0;
      this.editReport = !this.showUpdateList;
      this.completedTasks = [];
      report.completedTasks.forEach((reportValue) => {
        this.completedTasks.push({ value: reportValue });
      });
      report.completedTasks.length < 1
        ? this.completedTasks.push({ value: '' })
        : '';
    });
  }

  addNewInput() {
    this.completedTasks.push({ value: '' });
  }

  editReportButton() {
    this.editReport = true;
    this.showUpdateList = false;
  }

  submitReports() {
    if (this.completedTasks.every((val) => val.value.trim() !== '')) {
      if (
        this.eodReport.workingHours < 0.5 ||
        this.eodReport.workingHours > 24
      ) {
        this.dangerAlertShow = true;
        this.message =
          'Please add working hours minimum 0.5 and maximum 24 hours.';
      } else {
        this.dangerAlertShow = false;
        const user = localStorage.getItem('login');
        if (!user) return;
        this.dangerAlertShow = false;
        this.editReport = false;
        this.showUpdateList = true;
        const oldEodReport = { ...this.eodReport };
        oldEodReport.userId = JSON.parse(user).id;
        oldEodReport.completedTasks = this.completedTasks
          .map((val) => val.value)
          .filter((val) => val.trim() !== '');
        oldEodReport.updatedAt = new Date();
        oldEodReport.editCount = oldEodReport.editCount + 1;

        this.userService.updateEodReport(oldEodReport).subscribe({
          next: (res) => {
            this.successAlertShow = true;
            this.userService.eodReport.next(res);
            setTimeout(() => {
              this.successAlertShow = false;
            }, 1000);
          },
          error: () => {},
        });
      }
    } else {
      this.dangerAlertShow = true;
      this.message = 'Please add at least one task.';
    }
  }
}
