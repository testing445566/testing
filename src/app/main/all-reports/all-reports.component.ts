import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUser } from 'src/app/helper/interface/Iuser';
import { AdminService } from 'src/app/services/admin/user/admin.service';

@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.scss'],
})
export class AllReportsComponent implements OnInit {
  @ViewChild('formDate') formDate!: ElementRef;
  @ViewChild('toDate') toDate!: ElementRef;
  @ViewChild('selectEmployee') selectEmployee!: ElementRef;
  @ViewChild('reportType') reportType!: ElementRef;
  employessName: string[] = [];
  allReports: any = [];
  showReports: any = [];
  totalReports: number = 0;
  eodReports: number = 0;
  plannTasks: number = 0;
  activeEmployess: number = 0;
  miniDate =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '-' +
    String(new Date().getDate()).padStart(2, '0');

  curentDate =
    new Date().getFullYear() +
    '-' +
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '-' +
    String(new Date().getDate()).padStart(2, '0');
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUser().subscribe({
      next: (user) => {
        this.adminService.getPlannTask().subscribe({
          next: (res) => {
            const plannTask = res
              .map((val) => {
                const userFind: IUser = user.find(
                  (emp) => emp.id === val.userId
                ) as IUser;
                if (!userFind) return undefined;
                const date = new Date(val.createdAt).toLocaleString();
                return {
                  ...val,
                  type: 'Planned Tasks',
                  name: userFind.name,
                  department: userFind.department,
                  createdAt: date,
                };
              })
              .filter((val) => val !== undefined);
            this.allReports = [...this.allReports, ...plannTask];
            this.adminService.getEodReports().subscribe({
              next: (res) => {
                const eodReports = res
                  .map((val) => {
                    const userFind: IUser = user?.find(
                      (emp) => emp.id === val.userId
                    ) as IUser;
                    if (!userFind) return undefined;
                    const date = new Date(val.createdAt).toLocaleString();
                    return {
                      ...val,
                      type: 'EOD Report',
                      name: userFind.name,
                      department: userFind.department,
                      createdAt: date,
                    };
                  })
                  .filter((val) => val !== undefined);
                this.allReports = [...this.allReports, ...eodReports];
                this.getReports();
              },
            });
          },
        });
      },
    });

    this.adminService.getAllUser().subscribe({
      next: (res) => {
        this.employessName = res.map((val) => val.name);
      },
    });
  }

  getReports(search?: string) {
    const dateForm = this.formDate.nativeElement;
    const dateToDate = this.toDate.nativeElement;
    dateToDate.min = dateForm;
    if (dateForm.value > dateToDate.value) {
      dateToDate.value = dateForm.value;
    }
    const formDate = dateForm.value.split('-');
    const toDate = dateToDate.value.split('-');

    const fDate = new Date(+formDate[0], +formDate[1], +formDate[2]);
    const tDate = new Date(+toDate[0], +toDate[1], +toDate[2]);
    const allReport = this.allReports.filter((val: any) => {
      const date = val.date.split('/').reverse();
      const newDate = new Date(+date[0], +date[1], +date[2]);
      return fDate <= newDate && tDate >= newDate;
    });

    this.showReports = allReport
      .sort(function (a: any, b: any) {
        return a.date.localeCompare(b.date);
      })
      .filter((val: any): any => {
        const employee = this.selectEmployee.nativeElement.value
          ?.toString()
          .toLowerCase()
          .trim();
        const type = this.reportType.nativeElement.value
          .toString()
          .toLowerCase()
          .trim();

        return (
          (employee === 'all'
            ? true
            : val.name?.toString().toLowerCase().trim() === employee) &&
          (type === 'all'
            ? true
            : val.type?.toString().toLowerCase().trim() === type) &&
          (search
            ? [
                val?.tasks,
                val?.challenges,
                val.name,
                val.date,
                val?.completedTasks,
                val.department,
              ].some((val) =>
                val
                  ?.toString()
                  .toLowerCase()
                  .trim()
                  .includes(search?.toString().toLowerCase().trim())
              )
            : true)
        );
      });
    this.totalReports = this.showReports.length;
    this.eodReports = this.showReports.filter(
      (val: any) => val.type === 'EOD Report'
    ).length;
    this.plannTasks = this.showReports.filter(
      (val: any) => val.type === 'Planned Tasks'
    ).length;
    this.adminService.getActiveEmployee().subscribe({
      next: (res) => {
        this.activeEmployess = res.length;
      },
    });
  }
  toggelButton(card: HTMLElement, svg: HTMLElement) {
    if (card.offsetHeight < 10) {
      card.style.padding = '0 1.5rem 1.5rem 1rem';
      card.style.height = card.scrollHeight + 10 + 'px';
      card.style.overflow = 'none';
      svg.style.transform = 'rotate(-180deg)';
      card.style.borderTop = '1px solid rgb(243, 244, 246)';
    } else {
      card.style.height = '0px';
      card.style.padding = '0px';
      card.style.overflow = 'hidden';
      svg.style.transform = 'rotate(0deg)';
      card.style.borderTop = '0px solid rgb(243, 244, 246)';
    }
  }

  downloadCsvFile() {
    const data = this.showReports;
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
