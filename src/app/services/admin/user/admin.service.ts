import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEodReports } from 'src/app/helper/interface/IeodReport';
import { IPlannTask } from 'src/app/helper/interface/IplanTask';
import { IUser } from 'src/app/helper/interface/Iuser';
import { api } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getCurentDate(): string {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(api.userApi);
  }
  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${api.userApi}/${id}`);
  }
  deleteUser(id: string) {
    return this.http.delete<IUser>(`${api.userApi}/${id}`);
  }
  updateUser(id: string,data:IUser) {
    return this.http.patch<IUser>(`${api.userApi}/${id}`,data);
  }
  addUser(data:IUser) {
    return this.http.post<IUser>(`${api.userApi}`,data);
  }
  getAllUser(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${api.userApi}?role=employee`);
  }

  getPlannTask(): Observable<IPlannTask[]> {
    return this.http.get<IPlannTask[]>(api.planeTaskApi);
  }
  getEodReports(): Observable<IEodReports[]> {
    return this.http.get<IEodReports[]>(api.eodApi);
  }

  getCurentPlannTask(): Observable<IPlannTask[]> {
    return this.http.get<IPlannTask[]>(
      `${api.planeTaskApi}?date=${this.getCurentDate()}`
    );
  }

  getCurentEodReport(): Observable<IEodReports[]> {
    return this.http.get<IEodReports[]>(
      `${api.eodApi}?date=${this.getCurentDate()}&userId!=null`
    );
  }

  getActiveEmployee(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${api.userApi}?isActive=true&role=employee`);
  }

  getPlanTaskReport(date: string): Observable<IPlannTask[]> {
    return this.http.get<IPlannTask[]>(`${api.planeTaskApi}?date=${date}`);
  }
  getEodReport(date: string): Observable<IEodReports[]> {
    return this.http.get<IEodReports[]>(`${api.eodApi}?date=${date}`);
  }
}
