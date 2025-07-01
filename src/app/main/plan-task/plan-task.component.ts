import { Component, OnInit } from '@angular/core';
import { IPlannTask } from 'src/app/helper/interface/IplanTask';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-plan-task',
  templateUrl: './plan-task.component.html',
  styleUrls: ['./plan-task.component.scss'],
})
export class PlanTaskComponent implements OnInit {
  editAlertShow: boolean = false;
  plannTaskReport!: IPlannTask;
  successAlertShow: boolean = false;
  dangerAlertShow: boolean = false;
  tasks: { value: string }[] = [];
  editReport: boolean = true;
  showUpdateList: Boolean = false;

  constructor(private userService: UserService) {
    this.userService.getPlannTaskReport().subscribe({
      next: (res) => {
        if (res.length >= 1) {
          this.userService.planntaskReport.next(res[0]);
        } else {
          this.userService.planntaskReport.next(
            this.userService.planTaskReport
          );
        }
      },
      error: () => {},
    });
  }

  ngOnInit() {
    this.userService.planntaskReport.subscribe((report) => {
      this.plannTaskReport = report;
      this.tasks = [];
      report.tasks.forEach((element) => {
        this.tasks.push({ value: element });
      });
      report.tasks.length < 1 ? this.tasks.push({ value: '' }) : '';
      this.editReport = report.editCount < 0;
      this.showUpdateList = !this.editReport;
      this.editAlertShow = report.editCount > 0;
    });
  }

  addInputField() {
    this.tasks.push({ value: '' });
  }

  editPlanReport() {
    this.editReport = true;
    this.showUpdateList = false;
  }

  submitReport() {
    if (this.tasks.every((report) => report.value.trim() === '')) {
      this.dangerAlertShow = true;
      return;
    }
    const user = localStorage.getItem('login');
    if (!user) return;
    this.dangerAlertShow = false;
    this.editReport = false;
    this.showUpdateList = true;
    const oldReport = { ...this.plannTaskReport };
    oldReport.editCount = oldReport.editCount + 1;
    oldReport.updatedAt = new Date();
    oldReport.userId = JSON.parse(user).id;
    oldReport.tasks = this.tasks
      .map((val) => val.value)
      .filter((val) => val.trim() !== '');

    this.userService.updatePlannTaskReport(oldReport).subscribe({
      next: (res) => {
        this.editAlertShow = res.editCount > 0;
        this.successAlertShow = true;
        this.userService.planntaskReport.next(res);
        setTimeout(() => {
          this.successAlertShow = false;
        }, 1000);
      },
      error: () => {},
    });
  }

}