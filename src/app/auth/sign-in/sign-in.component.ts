import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signIn!: FormGroup;
  submit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signIn = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  get form() {
    return this.signIn.controls;
  }

  userLogin() {
    if (this.signIn.invalid) {
      this.submit = true;
      return;
    }
    this.authService.loginUser(this.signIn.value).subscribe({
      next: (res) => {
        if (res.length > 0) {
          localStorage.setItem('login', JSON.stringify(res[0]));
          this.toast.success('Login sucessfully.');
          this.router.navigate(['main']);
          this.authService.activeUser(res[0].id, true).subscribe({
            next: () => {},
            error: () => {},
          });
        } else {
          this.toast.warning('Email and password dose not match.');
        }
      },
      error: (rej) => {
        this.toast.warning('Network problem.');
      },
    });
  }

  setDemoUser(action: string) {
    switch (action) {
      case 'admin':
        this.signIn.patchValue({
          email: 'admin@gmail.com',
          password: 'Admin@123',
        });
        break;
      case 'user':
        this.signIn.patchValue({
          email: 'john.doe@company.com',
          password: 'Test@123',
        });
        break;
    }
  }
}
