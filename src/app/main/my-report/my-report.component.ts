import { WeekDay } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IEodReports } from 'src/app/helper/interface/IeodReport';
import { IPlannTask } from 'src/app/helper/interface/IplanTask';
import { IWeeklyReports } from 'src/app/helper/interface/IweeklyData';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-report',
  templateUrl: './my-report.component.html',
  styleUrls: ['./my-report.component.scss'],
})
export class MyReportComponent implements OnInit {
  @ViewChild('formDate') formDate!: ElementRef;
  @ViewChild('toDate') toDate!: ElementRef;
  @ViewChild('reportType') reportType!: ElementRef;
  eodReprts: IEodReports[] = [];
  plannTask: IPlannTask[] = [];
  allReports: IWeeklyReports[] = [];
  totalSubMissions: number = 0;
  completeDays: number = 0;
  plannedTasks: number = 0;
  eodReports: number = 0;
  plannedOnly: number = 0;
  eodOnly: number = 0;
  curentDate =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '-' +
    String(new Date().getDate()).padStart(2, '0');

  constructor(private userService: UserService) {}

  toggelButton(card: HTMLElement, svg: HTMLElement) {
    if (card.offsetHeight < 10) {
      card.style.padding = '1rem 1.5rem';
      card.style.height = card.scrollHeight + 40 + 'px';
      card.style.borderTop = ' 1px solid #e5e7eb';
      card.style.overflow = 'none';

      svg.style.transform = 'rotate(-180deg)';
    } else {
      card.style.height = '0px';
      card.style.padding = '0px';
      card.style.overflow = 'hidden';
      card.style.borderTop = ' 0px  solid #e5e7eb';
      svg.style.transform = 'rotate(0deg)';
    }
  }

  ngOnInit(): void {
    this.userService.getUserPlannReports().subscribe({
      next: (res) => {
        this.plannTask = res;
        this.userService.getUserEodReports().subscribe({
          next: (res) => {
            this.eodReprts = res;
            this.getReports();
          },
        });
      },
    });
  }

  getReports(search?: string): void {
    const formDate = this.formDate.nativeElement;
    const toDate = this.toDate.nativeElement;
    const reportType = this.reportType.nativeElement;
    toDate.min = formDate.value;
    if (formDate.value > toDate.value) {
      toDate.value = formDate.value;
    }
    const fDate = formDate.value.split('-');
    const tDate = toDate.value.split('-');

    const plannReport = this.plannTask.filter((val) => {
      const valDate = val.date.split('/').reverse();
      const date = new Date(+valDate[0], +valDate[1], +valDate[2]);
      return (
        new Date(+fDate[0], +fDate[1], +fDate[2]) <= date &&
        new Date(+tDate[0], +tDate[1], +tDate[2]) >= date
      );
    });
    const eodReports = this.eodReprts.filter((val) => {
      const valDate = val.date.split('/').reverse();
      const date = new Date(+valDate[0], +valDate[1], +valDate[2]);
      return (
        new Date(+fDate[0], +fDate[1], +fDate[2]) <= date &&
        new Date(+tDate[0], +tDate[1], +tDate[2]) >= date
      );
    });
    const dateFilter = new Set([
      ...plannReport.map((val) => val.date),
      ...eodReports.map((val) => val.date),
    ]);
    const allReports = Array.from(dateFilter).map((val) => {
      const plannTask = plannReport.find((plann) => plann.date === val) || null;
      const eodReport = eodReports.find((eod) => eod.date === val) || null;
      const date = val.split('/').reverse();
      const day = new Date(+date[0], +date[1] - 1, +date[2]).toLocaleDateString(
        'en-us',
        { weekday: 'short' }
      );
      plannTask
        ? (plannTask.updatedAt = new Date(plannTask.updatedAt).toLocaleString())
        : '';
      eodReport
        ? (eodReport.updatedAt = new Date(eodReport.updatedAt).toLocaleString())
        : '';

      return {
        day,
        plannTask,
        eodReport,
        date: val,
        status: plannTask && eodReport ? 'Completed' : 'Partial',
      };
    });

    this.allReports = allReports.filter((val) => {
      const type = reportType.value;
      if (type === 'allsubmissions') {
        return true;
      } else if (type === 'plannedtasksonly') {
        return val.plannTask && val.eodReport === null;
      } else if (type === 'eodreportsonly') {
        return val.plannTask === null && val.eodReport;
      } else {
        return val.plannTask && val.eodReport;
      }
    }) as IWeeklyReports[];

    if (search) {
      this.allReports = this.allReports.filter((val) => {
        return [
          val.date,
          val.day,
          val.plannTask.tasks,
          val.eodReport.completedTasks,
          val.eodReport.challenges,
          val.eodReport.workingHours,
        ].some((val1) =>
          val1
            ?.toString()
            .toLowerCase()
            .trim()
            .includes(search?.toString().toLowerCase().trim())
        );
      });
    }

    this.totalSubMissions = this.allReports.length;
    this.completeDays = this.allReports.filter(
      (val) => val.plannTask && val.eodReport
    ).length;
    this.plannedTasks = this.allReports.filter((val) => val.plannTask).length;
    this.eodReports = this.allReports.filter((val) => val.eodReport).length;
    this.plannedOnly = this.allReports.filter((val) => !val.plannTask).length;
    this.eodOnly = this.allReports.filter((val) => !val.eodReport).length;
  }
  downloadCsvFile() {
    const data = this.allReports
      .map((val) => [{ ...val.plannTask }, { ...val.eodReport }])
      .flat(Infinity);

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
