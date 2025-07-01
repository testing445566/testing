import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { IRoleUser } from 'src/app/helper/interface/IuserRole';
import { CheckUserService } from 'src/app/services/user-role/check-user.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userRole!: IRoleUser;
  profileDetails!: FormGroup;
  id: string = '';
  successAlertShow: boolean = false;
  constructor(
    private fb: FormBuilder,
    private checkUserService: CheckUserService,
    private userService: UserService
  ) {
    this.checkUserService.getUser();
  }

  ngOnInit(): void {
    this.checkUserService.userRole.subscribe((userRole) => {
      this.userRole = userRole;
    });
    this.profileDetails = this.fb.group({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,1}$/),
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/(.+)@(.+){2,}\.(.+){2,}/),
        ])
      ),
      department: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      position: new FormControl('', Validators.compose([Validators.required])),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
        ])
      ),
    });

    this.userService.getUserProfileDetails().subscribe({
      next: (res) => {
        const userProfileDetails = res;
        this.id = res.id;
        this.profileDetails.patchValue({
          name: userProfileDetails?.name || '',
          email: userProfileDetails.email || '',
          department: userProfileDetails.department || '',
          position: userProfileDetails.position || '',
          phone: userProfileDetails.phone || '',
        });
      },
    });
  }

  get form() {
    return this.profileDetails.controls;
  }

  updateProfileDetails() {
    this.userService
      .updateUser(this.id, this.profileDetails.value)
      .subscribe((res) => {
        localStorage.setItem('login', JSON.stringify(res));
        this.successAlertShow = true;
        setTimeout(() => {
          this.successAlertShow = false;
        }, 2000);
      });
  }
}
