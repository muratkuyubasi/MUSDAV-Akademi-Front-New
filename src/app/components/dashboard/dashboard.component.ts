import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OnlineUser } from '@core/domain-classes/online-user';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { SignalrService } from '@core/services/signalr.service';
import { environment } from '@environments/environment';
import { BaseComponent } from '../../base.component';
import { UserService } from '../user/user.service';
import { DashboardService } from './dashboard.service';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  appUserAuth: UserAuth = null;
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'phoneNumber'];
  recentlyRegisteredUsers: User[] = [];
  totalUserCount = 0;
  totalBookCount = 0;
  totalIssueCount = 0;
  totalOldIssueCount = 0;
  activeUserCount = 0;
  inactiveUserCount = 0;
  onlineUsers: User[];
  onlinerUsersCount: number = 0;
  currentIssues:any[]=[]

  constructor(private userService: UserService,
    private dashboardService: DashboardService,
    private securityService:SecurityService,
    private signalrService: SignalrService) {
    super();
  }

  ngOnInit() {
    this.setTopLogAndName()
    // this.getTotalBookCount()
    // this.getTotalIssueCount()
    // this.getTotalOldIssueCount()
    this.getRecentlyRegisteredUsers();
    this.getRecentlyRegisteredUsers();
    // this.getCurrentIssues();

    // this.getActiveUserCount();
    // this.getInactiveUserCount();
    this.getTotalUserCount();
    // this.getOnlineUsers();
  }

  getTotalBookCount(){
    this.sub$.sink = this.dashboardService.getTotalBookCount().subscribe((count: number) => this.totalBookCount = count);
  }
  getTotalIssueCount(){
    this.sub$.sink = this.dashboardService.getTotalIssueCount().subscribe((count: number) => this.totalIssueCount = count);
  }
  getTotalOldIssueCount(){
    this.sub$.sink = this.dashboardService.getTotalOldIssueCount().subscribe((count: number) => this.totalOldIssueCount = count);
  }

  getCurrentIssues(){
    this.sub$.sink = this.dashboardService.getCurrentIssues().subscribe((resp: any) => this.currentIssues = resp);
  }

  getOnlineUsers() {
    this.sub$.sink = this.signalrService.onlineUsers$.subscribe(c => {
      if (c) {
        this.sub$.sink = this.dashboardService.getOnlineUser()
          .subscribe((resp: User[]) => {
            this.onlineUsers = resp;
            this.onlineUsers.forEach(user => {
              if (user.profilePhoto) {
                user.profilePhoto = `${environment.apiUrl}${user.profilePhoto}`
              }
            })
          });
        this.onlinerUsersCount = c.length;
      } else {
        this.onlineUsers = [];
        this.onlinerUsersCount = 0;
      }
    })
  }

  getRecentlyRegisteredUsers() {
    this.sub$.sink = this.userService.getRecentlyRegisteredUsers().subscribe((users: User[]) => {
      this.recentlyRegisteredUsers = users;
    });
  }

  getActiveUserCount() {
    this.sub$.sink = this.dashboardService.getActiveUserCount().subscribe((count: number) => this.activeUserCount = count);
  }

  getInactiveUserCount() {
    this.sub$.sink = this.dashboardService.getInactiveUserCount().subscribe((count: number) => this.inactiveUserCount = count);
  }

  getTotalUserCount() {
    this.sub$.sink = this.dashboardService.getTotalUserCount().subscribe((count: number) => this.totalUserCount = count);
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
      if (c) {
        this.appUserAuth = c;
        if (this.appUserAuth.profilePhoto) {
          this.appUserAuth.profilePhoto = `${environment.apiUrl}${this.appUserAuth.profilePhoto}`
        }
      }
    })
  }
}

