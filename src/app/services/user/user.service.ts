import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IEodReports } from 'src/app/helper/interface/IeodReport';
import { IPlannTask } from 'src/app/helper/interface/IplanTask';
import { IUser } from 'src/app/helper/interface/Iuser';
import { api } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  date = new Date();
  planTaskReport = {
    updatedAt: this.date,
    createdAt: this.date,
    date: this.getLiveDate(),
    editCount: -1,
    tasks: [],
    userId: this.getUserDetails(),
  };

  eodReports = {
    challenges: '',
    completedTasks: [],
    date: this.getLiveDate(),
    editCount: -1,
    updatedAt: this.date,
    userId: this.getUserDetails(),
    workingHours: 0.5,
    createdAt: this.date,
  };

  eodReport = new BehaviorSubject<IEodReports>(this.eodReports);
  planntaskReport = new BehaviorSubject<IPlannTask>(this.planTaskReport);

  constructor(private http: HttpClient) {}
  getLiveDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month + 1}/${year}`;
  }

  getUserDetails(): string {
    const user = localStorage.getItem('login');
    if (user) {
      return JSON.parse(user).id;
    }
    return '';
  }

  getEodReports(): Observable<IEodReports[]> {
    const curentDate = this.getLiveDate();
    return this.http.get<IEodReports[]>(
      `${api.eodApi}?date=${curentDate}&userId=${this.getUserDetails()}`
    );
  }
  getPlannTaskReport(): Observable<IPlannTask[]> {
    const curentDate = this.getLiveDate();
    return this.http.get<IPlannTask[]>(
      `${api.planeTaskApi}?date=${curentDate}&userId=${this.getUserDetails()}`
    );
  }

  updatePlannTaskReport(newPlanReport: IPlannTask): Observable<IPlannTask> {
    if (newPlanReport.id) {
      return this.http.put<IPlannTask>(
        `${api.planeTaskApi}/${newPlanReport.id}`,
        newPlanReport
      );
    } else {
      return this.http.post<IPlannTask>(`${api.planeTaskApi}`, newPlanReport);
    }
  }
  updateEodReport(newEodReport: IEodReports): Observable<IEodReports> {
    if (newEodReport.id) {
      return this.http.put<IEodReports>(
        `${api.eodApi}/${newEodReport.id}`,
        newEodReport
      );
    } else {
      return this.http.post<IEodReports>(`${api.eodApi}`, newEodReport);
    }
  }

  getUserProfileDetails(): Observable<IUser> {
    return this.http.get<IUser>(`${api.userApi}/${this.getUserDetails()}`);
  }

  updateUser(id: string, data: IUser): Observable<IUser> {
    return this.http.patch<IUser>(`${api.userApi}/${id}`, data);
  }

  getUserEodReports(): Observable<IEodReports[]> {
    return this.http.get<IEodReports[]>(
      `${api.eodApi}?userId=${this.getUserDetails()}`
    );
  }
  getUserPlannReports(): Observable<IPlannTask[]> {
    return this.http.get<IPlannTask[]>(
      `${api.planeTaskApi}?userId=${this.getUserDetails()}`
    );
  }

  getPlannTaskReports(): Observable<IPlannTask[]> {
    return this.http.get<IPlannTask[]>(`${api.planeTaskApi}`).pipe(
      map((val) =>
        val.filter((report): boolean => {
          const today = new Date();
          const lastDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 7
          );
          const date = report.date.split('/').reverse();
          const reportDate = new Date(+date[0], +date[1], +date[2]);
          const reportConvertDate = new Date(
            reportDate.getFullYear(),
            reportDate.getMonth() - 1,
            reportDate.getDate()
          );
          if (
            today >= reportConvertDate &&
            lastDay < reportConvertDate &&
            report.userId === this.getUserDetails()
          ) {
            return true;
          } else {
            return false;
          }
        })
      )
    );
  }

  getEodReport(): Observable<IEodReports[]> {
    return this.http.get<IEodReports[]>(`${api.eodApi}`).pipe(
      map((val) =>
        val.filter((report): boolean => {
          const today = new Date();
          const lastDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 7
          );
          const date = report.date.split('/').reverse();
          const reportDate = new Date(+date[0], +date[1], +date[2]);
          const reportConvertDate = new Date(
            reportDate.getFullYear(),
            reportDate.getMonth() - 1,
            reportDate.getDate()
          );

          if (
            today >= reportConvertDate &&
            lastDay < reportConvertDate &&
            report.userId === this.getUserDetails()
          ) {
            return true;
          } else {
            return false;
          }
        })
      )
    );
  }
  logOutUser(id: string): Observable<IUser> {
    const user = { isActive: false };
    return this.http.patch<IUser>(`${api.userApi}/${id}`, user);
  }
}
