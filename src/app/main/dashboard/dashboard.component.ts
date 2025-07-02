import { Component, OnInit } from "@angular/core";
import { IEodReports } from "src/app/helper/interface/IeodReport";
import { IRoleUser } from "src/app/helper/interface/IuserRole";
import { AdminService } from "src/app/services/admin/user/admin.service";
import { CheckUserService } from "src/app/services/user-role/check-user.service";
import { UserService } from "src/app/services/user/user.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  // employee variable
  userRole!: IRoleUser;
  isAdmin!: boolean;
  header!: string;
  subHeading!: string;
  taskPlanned: string = "Pending";
  eodReport: string = "Pending";
  weeklyReport: number = 0;
  avgWorkingHoures: number = 0;
  resentActivity: any = [];

  // admin varable
  totalEmployees: number = 0;
  todaySubmissions: number = 0;
  pendingReports: number = 0;
  weeklyCompliancesReports = [];
  complianceRateReport: any = [];
  tasksPlanned: number = 0;
  reportsSubmitted: number = 0;
  daysName: string[] = [];
  constructor(
    private checkUserService: CheckUserService,
    private userService: UserService,
    private adminService: AdminService
  ) {}

  convertDate(value: Date) {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  ngOnInit(): void {
    this.checkUserService.getUser();
    this.checkUserService.userRole.subscribe((userRole) => {
      this.userRole = userRole;
      this.isAdmin = userRole.isAdmin;
      this.header = this.isAdmin
        ? "Admin Dashboard"
        : `Welcome back, ${userRole.name.split(" ")[0]}!`;
      this.subHeading = this.isAdmin
        ? "Overview of employee work tracking and compliance"
        : "Here's your work summary for today";
    });

    if (this.isAdmin) {
      this.adminActions();
    } else {
      this.userActiona();
    }
  }

  userActiona(): void {
    this.userService.getPlannTaskReports().subscribe((plannReport) => {
      console.log(plannReport[0])
      this.taskPlanned =
        plannReport[0].editCount < 0 ? "Pending" : "Completed";
      this.userService.getEodReport().subscribe((eodReport) => {
        this.weeklyReport = plannReport.filter((report) => {
          return eodReport.some((val) => {
            const valDate = val.date.split("/").reverse();
            const reportDate = report.date.split("/").reverse();
            const date = new Date(+valDate[0], +valDate[1], +valDate[2]);
            const eodDate = new Date(
              +reportDate[0],
              +reportDate[1],
              +reportDate[2]
            );
            return (
              date.getDate() === eodDate.getDate() &&
              date.getMonth() === eodDate.getMonth() &&
              date.getFullYear() === eodDate.getFullYear() &&
              val.userId === report.userId &&
              val.editCount > -1 &&
              report.editCount > -1
            );
          });
        }).length;
        this.avgWorkingHoures = eodReport.reduce((acc, val) => {
          acc = acc + val.workingHours;
          return acc;
        }, 0);
      });
    });
    this.userService.getEodReports().subscribe({
      next: (res) => {
        if (res.length > 0) {
          const data = res[0];
          this.resentActivity.push({
            type: "End-of-Day Report",
            date: data.date,
            workingHours: data.workingHours,
            editCount: data.completedTasks.length,
          });
          this.eodReport = "Completed";
        }
      },
    });
  }

  adminActions(): void {
    this.adminService.getAllUser().subscribe({
      next: (res) => {
        this.totalEmployees = res.length;
        const days: any = {};
        const curentDate = new Date().getDate();
        for (let i = 0; i < 7; i++) {
          const date = new Date(new Date().setDate(curentDate - i));
          const localDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          days[localDate] = [];
        }
        this.adminService.getPlannTask().subscribe({
          next: (resPlannTask) => {
            this.adminService.getEodReports().subscribe({
              next: (resEod) => {
                Object.keys(days).forEach((key) => {
                  var total = 0;
                  const day: string[] = key.split("/").reverse();
                  const getDay = new Date(
                    +day[0],
                    +day[1] - 1,
                    +day[2]
                  ).toLocaleDateString("en-in", { weekday: "short" });
                  this.daysName.push(getDay);
                  this.daysName.sort(function (a, b) {
                    return a.localeCompare(b);
                  });
                  days[key] = (res || [0])
                    .map((val) => {
                      const data = [...resPlannTask, ...resEod].filter(
                        (report) => {
                          return (
                            report.date === key && val.id === report.userId
                          );
                        }
                      );
                      return data.length;
                    })
                    .reduce((acc, val) => {
                      if (val === 2) {
                        total = total + 1;
                      }
                      acc = { total, day: getDay };
                      return acc;
                    }, {});
                });
                Object.keys(days).forEach((val) => {
                  if (days) this.complianceRateReport.push(days[val]);
                });
                this.complianceRateReport.reverse();
                this.complianceRateReport[
                  this.complianceRateReport.length - 1
                ].day = "Today";
                this.complianceRateReport[
                  this.complianceRateReport.length - 2
                ].day = "Yesterday";
              },
            });
          },
        });
        this.adminService.getCurentPlannTask().subscribe({
          next: (plannTask) => {
            const planReports = plannTask.filter((val) => val.userId !== null);
            this.adminService.getCurentEodReport().subscribe({
              next: (eodReport) => {
                const newEodReports = eodReport.filter(
                  (val) => val.userId !== null
                );
                this.resentActivity = res
                  .map((user) => {
                    const report = newEodReports.find(
                      (report) => user.id === report.userId
                    ) as IEodReports;

                    const planTask = planReports.find(
                      (task) => user.id === task.userId
                    );
                    if (planTask) {
                      this.tasksPlanned = this.tasksPlanned + 1;
                    }
                    if (report) {
                      this.reportsSubmitted = this.reportsSubmitted + 1;
                    }
                    if (planTask && report) {
                      this.todaySubmissions = this.todaySubmissions + 1;
                      this.pendingReports =
                        this.totalEmployees - this.todaySubmissions || 0;
                    }
                    if (report) {
                      return {
                        type: user.name,
                        date: `End-of-Day Report • ${report.date}`,
                        workingHours: report.workingHours,
                        editCount: report.completedTasks.length,
                      };
                    } else {
                      return undefined;
                    }
                  })
                  .filter((val) => val !== undefined);
              },
            });
          },
        });
      },
      error: (rej) => {},
    });
  }
}
