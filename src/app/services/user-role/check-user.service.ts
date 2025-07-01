import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { IRoleUser } from 'src/app/helper/interface/IuserRole';

@Injectable({
  providedIn: 'root',
})
export class CheckUserService {
  date = this.getLiveDate();
  userData = {
    id: '',
    name: 'John doe',
    createdAt: '10/06/2025',
    role: 'employee',
    isAdmin: false,
    curentDate: this.date,
  };
  userRole = new BehaviorSubject<IRoleUser>(this.userData);

  constructor(private router: Router) {}

  getUser() {
    const user = localStorage.getItem('login');
    if (user) {
      const userDetails = JSON.parse(user);

      this.userData.name = userDetails.name;
      this.userData.createdAt = userDetails.createdAt;
      this.userData.role = userDetails.role;
      this.userData.isAdmin = userDetails.role === 'admin' ? true : false;
      this.userData.id = userDetails.id;
      this.userRole.next(this.userData);
    } else {
      localStorage.removeItem('login');
      this.router.navigate(['auth']);
    }
  }

  getLiveDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month + 1}/${year}`;
  }
}
