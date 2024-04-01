import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@core/domain-classes/role';
import { User } from '@core/domain-classes/user';
import { UserAllowedIP } from '@core/domain-classes/user-allowed-Ip';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UserService } from '../user.service';


@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent extends BaseComponent implements OnInit {
  user: User;
  userForm: UntypedFormGroup;
  roleList: Role[];
  isEditMode = false;
  selectedRoles: Role[] = [];
  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private translationService:TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.createUserForm();
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { user: User }) => {
        if (data.user) {
          this.isEditMode = true;
          this.userForm.patchValue(data.user);
          this.userForm.get('userAllowedIPs').patchValue(data.user.userAllowedIPs);
          this.user = data.user;
        } else {
          this.userForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
          this.userForm.get('confirmPassword').setValidators([Validators.required]);
        }
      });
    this.getRoles();
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(new RegExp(/^(\d{10})$/))]],
      password: [''],
      confirmPassword: [''],
      address: [''],
      isActive: [true],
      userAllowedIPs: this.fb.array([this.newIP()])
    }, {
      validator: this.checkPasswords
    });
  }

  get userAllowedIPs(): UntypedFormArray {
    return this.userForm.get("userAllowedIPs") as UntypedFormArray
  }

  newIP(): UntypedFormGroup {
    return this.fb.group({
      userId: [''],
      ipAddress: ['']
    })
  }

  addIP() {
    this.userAllowedIPs.push(this.newIP());
  }

  removeIP(i: number) {
    this.userAllowedIPs.removeAt(i);
  }

  checkPasswords(group: UntypedFormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true }
  }

  saveUser() {
    if (this.userForm.valid) {
      const user = this.createBuildObject();
      if (this.isEditMode) {
        this.sub$.sink = this.userService.updateUser(user).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('USER_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/admin/users']);
        });
      } else {
        this.sub$.sink = this.userService.addUser(user).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('USER_CREATED_SUCCESSFULLY'));
          this.router.navigate(['/admin/users']);
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  createBuildObject(): User {
    const userId = this.userForm.get('id').value;
    const user: User = {
      id: userId,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      password: this.userForm.get('password').value,
      userName: this.userForm.get('email').value,
      isActive: this.userForm.get('isActive').value,
      address: this.userForm.get('address').value,
      userRoles: this.getSelectedRoles(),
      userAllowedIPs: (this.userAllowedIPs.value as UserAllowedIP[]).filter(c => c.ipAddress)
    }
    return user;
  }

  getSelectedRoles() {
    return this.selectedRoles.map((role) => {
      return {
        userId: this.userForm.get('id').value,
        roleId: role.id
      }
    })
  }

  getRoles() {
    this.sub$.sink = this.commonService.getRoles().subscribe((roles: Role[]) => {
      this.roleList = roles;
      if (this.isEditMode) {
        const selectedRoleIds = this.user.userRoles.map(c => c.roleId);
        this.selectedRoles = this.roleList.filter(c => selectedRoleIds.indexOf(c.id) > -1);

      }
    });
  }
}
