import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@core/domain-classes/user';
import { UserAuth } from '@core/domain-classes/user-auth';
import { CommonError } from '@core/error-handler/common-error';
import { SecurityService } from '@core/security/security.service';
import { SignalrService } from '@core/services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-profile-authentication-page',
  templateUrl: './profile-authentication-page.component.html',
  styleUrls: ['./profile-authentication-page.component.scss']
})
export class ProfileAuthenticationPageComponent extends BaseComponent implements OnInit {

  appUserAuth:UserAuth=null;
  loginFormGroup: UntypedFormGroup;
  isLoading = false;
  userData: User;
  resultMessage: string;
  fieldTextType: boolean = false;
  lat: number;
  lng: number;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private signalrService: SignalrService
  ) {
    super()
    this.setTopLogAndName()
   }

   ngOnInit(): void {

    this.createFormGroup();
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      this.isLoading = true;
      var userObject = Object.assign(this.loginFormGroup.value, { latitude: this.lat, longitude: this.lng });
      this.sub$.sink = this.securityService.login(userObject)
        .subscribe(
          (c: UserAuth) => {
            // const userInfo: OnlineUser = {
            //   email: c.email,
            //   id: c.id,
            //   connectionId: null
            // }
            // this.signalrService.addUser(userInfo);
            this.isLoading = false;
            this.toastr.success('Kullanıcı Girişi Başarılı.');
            // admin-lte issue for side bar https://github.com/ColorlibHQ/AdminLTE/issues/3599
            window.location.href = "/dashboard";
          },
          (err: CommonError) => {
            this.isLoading = false;
            if (err.messages) {
              err.messages.forEach(msg => {
                this.toastr.error(msg);
              });
            } else if (err.error) {
              this.toastr.error(err.error as string);
            }
          }
        );
    }
  }

  createFormGroup(): void {
    this.loginFormGroup = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
      if (c) {
        this.appUserAuth = c 
        this.router.navigate(['/dashboard'])
      }
    })
}

}
