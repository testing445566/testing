import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CheckUserService } from 'src/app/services/user-role/check-user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user: string = 'John Deo';
  role: string = 'Employee';
  isAdmin: boolean = false;
  id: string = '';

  constructor(
    private checkUserService: CheckUserService,
    private router: Router,
    private userService: UserService
  ) {
    this.checkUserService.getUser();
  }
  ngOnInit(): void {
    this.checkUserService.userRole.subscribe((val) => {
      this.role = val.role;
      this.user = val.name;
      this.isAdmin = val.isAdmin;
      this.id = val.id;
    });
  }
  logOutUser() {
    this.userService.logOutUser(this.id).subscribe({
      next: (res) => {
        localStorage.removeItem('login');
        this.router.navigate(['auth']);
      },
      error: (error) => {
        localStorage.removeItem('login');
        this.router.navigate(['auth']);
      },
    });
  }
}
