import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';
declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        trigger('slide', [
          state('up', style({ height: 0 })),
          state('down', style({ height: '*' })),
          transition('up <=> down', animate(200))
        ])
      ]
})
export class SidebarComponent extends BaseComponent implements OnInit {

    appUserAuth: UserAuth = null;

  constructor(
    private securityService: SecurityService) {
    super();
  }

    ngOnInit() {
        this.setTopLogAndName();
      }
    
      setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$
          .subscribe(c => {
            if (c) {
              this.appUserAuth = c;
             
            }
          })
      }
}