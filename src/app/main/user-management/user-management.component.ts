import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IUser } from 'src/app/helper/interface/Iuser';
import { AdminService } from 'src/app/services/admin/user/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  addUser!: FormGroup;
  allUser: IUser[] = [];
  update: boolean = false;
  addNewUserModalToggel: boolean = false;
  showDisplay: IUser[] = [];
  id!: string;
  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.addUser = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/(.+)@(.+){2,}\.(.+){2,}/),
        ])
      ),
      role: new FormControl(
        'employee',
        Validators.compose([Validators.required])
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
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          ),
        ])
      ),
    });

    this.adminService.getAllUsers().subscribe({
      next: (user) => {
        this.allUser = user;
        this.showDisplay = user;
      },
    });
  }

  openModal(action: string = 'open') {
    this.addUser.reset();
    this.addUser.patchValue({
      role: 'employee',
    });
    this.update = false;
    this.addNewUserModalToggel = action === 'open' ? true : false;
    this.addUser.get('role')?.enable();
    this.addUser.get('password')?.enable();
  }

  getUser(id: string) {
    const user = localStorage.getItem('login');
    if (!user) return;
    this.adminService.getUser(id).subscribe((val) => {
      this.id = val.id;
      if (val.master && val.id !== JSON.parse(user).id) {
        this.addUser.get('password')?.disable();
        this.addUser.get('role')?.disable();
      } else {
        this.addUser.get('role')?.enable();
        this.addUser.get('password')?.enable();
      }
      if (val.master) {
        this.addUser.get('role')?.disable();
      }
      this.addUser.patchValue({
        name: val.name,
        email: val.email,
        role: val.role,
        department: val.department,
        position: val.position,
        phone: val.phone,
        password: val.password,
      });
      this.update = true;
      this.addNewUserModalToggel = true;
    });
  }

  closeModal() {
    this.addNewUserModalToggel = false;
  }

  getLiveDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  deleteUser(id: string) {
    const result = confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
    if (result) {
      this.adminService.deleteUser(id).subscribe({
        next: (res) => {
          this.allUser = this.allUser.filter((val) => val.id !== res.id);
        },
      });
    }
  }

  get form() {
    return this.addUser.controls;
  }
  submitUser() {
    if (this.update) {
      this.adminService.updateUser(this.id, this.addUser.value).subscribe({
        next: (res) => {
          this.allUser = this.allUser.map((val) => {
            if (val.id === res.id) {
              val = res;
            }
            return val;
          });
          this.showDisplay = this.showDisplay.map((val) => {
            if (val.id === res.id) {
              val = res;
            }
            return val;
          });
        },
      });
    } else {
      const user = {
        ...this.addUser.value,
        isActive: false,
        createdAt: this.getLiveDate(),
        master: false,
      };
      this.adminService.addUser(user).subscribe({
        next: (res) => {
          this.showDisplay.push(res);
        },
      });
    }
    this.addNewUserModalToggel = false;
  }

  searchUser(search: string) {
    if (search) {
      this.showDisplay = this.allUser.filter((val) => {
        return [
          val.name,
          val.email,
          val.department,
          val.role,
          val.position,
          val.createdAt,
        ].some((val) =>
          val
            ?.toString()
            .toLowerCase()
            .trim()
            .includes(search?.toString().toLowerCase().trim())
        );
      });
    } else {
      this.showDisplay = this.allUser;
    }
  }
}
