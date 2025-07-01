import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/helper/interface/Iuser';
import { ILoginUser } from 'src/app/helper/interface/auth/IloginUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  loginUser(data: ILoginUser): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      `${api.userApi}?email=${data.email}&password=${data.password}`
    );
  }

  activeUser(id: string, data: boolean) {
    return this.http.patch<IUser>(`${api.userApi}/${id}`, { isActive: data });
  }
}
