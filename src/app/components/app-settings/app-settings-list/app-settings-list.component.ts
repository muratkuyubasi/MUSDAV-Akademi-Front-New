import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { AppSetting } from '@core/domain-classes/app-setting';
import { CommonError } from '@core/error-handler/common-error';
import { AppSettingService } from '@core/services/app-setting.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { AppSettingsManageComponent } from '../app-settings-manage/app-settings-manage.component';

@Component({
  selector: 'app-app-settings-list',
  templateUrl: './app-settings-list.component.html',
  styleUrls: ['./app-settings-list.component.scss']
})
export class AppSettingsListComponent extends BaseComponent implements OnInit {

  appSettings: AppSetting[] = [];
  displayedColumns: string[] = ['action','name', 'key', 'value'];
  isLoadingResults = true;

  constructor(
    private dialog: MatDialog,
    private appSettingService: AppSettingService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAppSettings();
  }

  deleteAppSetting(appSetting: AppSetting) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${appSetting.key}`)
      .subscribe((flag: boolean) => {
        if (flag) {
          this.sub$.sink = this.appSettingService.deleteAppSetting(appSetting.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue(`APPSETTING_DELETED`));
              this.getAppSettings();
            });
        }
      });
  }

  getAppSettings(): void {
    this.sub$.sink = this.appSettingService.getAppSettings()
      .subscribe((data: AppSetting[]) => {
        this.appSettings = data;
      }, (err: CommonError) => {
        err.messages.forEach(msg => {
        });
      });
  }
  onManageAppSetting(appSetting?: AppSetting): void {
    const dialogRef = this.dialog.open(AppSettingsManageComponent, {
      width: '350px',
      data: appSetting ? Object.assign({}, appSetting) : null
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe(result => {
        this.getAppSettings();
      });
  }

}
