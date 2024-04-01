import { Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { User } from '@core/domain-classes/user';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
// import { DashboardService } from '@core/services/dashboard.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent extends BaseComponent implements OnInit {

  onlineUsers: User[] = [];

  constructor(
    private signalrService: SignalrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
    // private dashboardService: DashboardService
    ) {
    super();
  }

  ngOnInit(): void {
    this.getOnlineUsers();
    this.getChangeOnlineUsers();
  }
  getOnlineUsers() {
    // this.sub$.sink = this.dashboardService.getOnlineUser().subscribe((users: User[]) => {
    //   this.onlineUsers = users;
    // })
  }

  getChangeOnlineUsers() {
    this.sub$.sink = this.signalrService.onlineUsers$.subscribe(c => {
      this.getOnlineUsers();
    });
  }
  onForceLogout(id: string) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_FORCE_LOGOUT_USER'))
      .subscribe((flag: boolean) => {
        if (flag) {
          this.signalrService.forceLogout(id);
        }
      });
  }
}
