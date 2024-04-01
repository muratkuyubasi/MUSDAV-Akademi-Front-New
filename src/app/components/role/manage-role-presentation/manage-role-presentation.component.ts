import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { PageAction } from '@core/domain-classes/page-action';
import { Page } from '@core/domain-classes/page';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Role } from '@core/domain-classes/role';

@Component({
  selector: 'app-manage-role-presentation',
  templateUrl: './manage-role-presentation.component.html',
  styleUrls: ['./manage-role-presentation.component.scss']
})
export class ManageRolePresentationComponent implements OnInit {

  @Input() pages: Page[];
  @Input() actions: Action[];
  @Input() pageActions: PageAction[];
  @Input() loading: boolean;
  @Input() loadingPage: boolean;
  @Input() loadingAction: boolean;
  @Input() role: Role;
  @Output() onManageRoleAction: EventEmitter<Role> = new EventEmitter<Role>();
  constructor() { }

  ngOnInit(): void {

  }

  checkPageAction(pageId: string, actionId: string): boolean {
    const pageAction = this.pageActions.find(c => c.pageId === pageId && c.actionId === actionId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  checkPermission(pageId: string, actionId: string): boolean {
    const pageAction = this.role.roleClaims.find(c => c.pageId === pageId && c.actionId === actionId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  onPermissionChange(flag: MatSlideToggleChange, page: Page, action: Action) {
    if (flag.checked) {
      this.role.roleClaims.push({
        roleId: this.role.id,
        claimType: `${page.name}_${action.name}`,
        claimValue: '',
        pageId: page.id,
        actionId: action.id
      })
    } else {
      const roleClaimToRemove = this.role.roleClaims.find(c => c.actionId === action.id && c.pageId === page.id);
      const index = this.role.roleClaims.indexOf(roleClaimToRemove, 0);
      if (index > -1) {
        this.role.roleClaims.splice(index, 1);
      }
    }
  }

  saveRole(): void {
    this.onManageRoleAction.emit(this.role);
  }
}
