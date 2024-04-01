import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from '@core/domain-classes/app-setting';
import { AppSettingService } from '@core/services/app-setting.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'SubSink';

@Component({
  selector: 'app-app-settings-manage',
  templateUrl: './app-settings-manage.component.html',
  styleUrls: ['./app-settings-manage.component.scss']
})
export class AppSettingsManageComponent implements OnInit {

  isEdit: boolean = false;
  appSettingForm: UntypedFormGroup;
  appSetting: AppSetting;
  sub$: SubSink
  constructor(
    public dialogRef: MatDialogRef<AppSettingsManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppSetting,
    private toastrServoce: ToastrService,
    private appSettingService: AppSettingService,
    private fb: UntypedFormBuilder,
    private translationService: TranslationService) {
    this.sub$ = new SubSink();
  }
  ngOnInit() {
    if (this.data) {
      this.isEdit = true;
      this.appSetting = this.data;
    }
    this.createForm();
    this.patchValue();
    this.appSettingValueChange();
  }

  appSettingValueChange() {
    if (!this.appSetting) {
      this.sub$.sink = this.appSettingForm.get('name').valueChanges
        .subscribe(c => {
          const newKey = c.replace(/[^A-Z0-9]/ig, "_");
          this.appSettingForm.patchValue({
            key: newKey.toLowerCase()
          });
        });

      this.sub$.sink = this.appSettingForm.get('key').valueChanges
        .subscribe(c => {
          const newKey = c.replace(/[^A-Z0-9]/ig, "_");
          if (newKey !== this.appSettingForm.get('key').value) {
            this.appSettingForm.patchValue({
              key: newKey.toLowerCase()
            });
          }
        })
    }
  }

  createForm() {
    this.appSettingForm = this.fb.group({
      name: ['', [Validators.required]],
      key: [{ value: '', disabled: this.isEdit }, [Validators.required]],
      value: ['', [Validators.required]]
    })
  }
  patchValue() {
    if (this.appSetting) {
      this.appSettingForm.patchValue({
        name: this.appSetting.name,
        key: this.appSetting.key,
        value: this.appSetting.value
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  buidForm(): AppSetting {
    const appSetting: AppSetting = {
      id: this.appSetting ? this.appSetting.id : null,
      name: this.appSettingForm.get('name').value,
      key: this.appSetting ? this.appSetting.key : this.appSettingForm.get('key').value,
      value: this.appSettingForm.get('value').value,
    };
    return appSetting;
  }

  saveAppSetting(): void {
    if (this.appSettingForm.valid) {
      if (this.appSetting) {
        this.sub$.sink = this.appSettingService.updateAppSetting(this.buidForm())
          .subscribe(d => {
            this.toastrServoce.success(this.translationService.getValue('APPSETTING_UPDATED_SUCCESSFULLY'));
            this.dialogRef.close();
          });
      } else {
        const key = this.appSettingForm.get('key').value;
        const newKey = key.replace(/[^A-Z0-9]/ig, "_");
        const appSettingFormValue = this.buidForm();
        appSettingFormValue.key = newKey.trim();
        this.sub$.sink = this.appSettingService.addAppSetting(appSettingFormValue)
          .subscribe(() => {
            this.toastrServoce.success(this.translationService.getValue(`APPSETTING_SAVE_SUCCESSFULLY`));
            this.dialogRef.close();
          });
      }
    } else {
      this.appSettingForm.markAllAsTouched();
    }
  }

}
