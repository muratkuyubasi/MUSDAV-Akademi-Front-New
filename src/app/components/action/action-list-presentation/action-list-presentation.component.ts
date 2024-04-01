import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Action } from '@core/domain-classes/action';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageActionComponent } from '../manage-action/manage-action.component';

@Component({
  selector: 'app-action-list-presentation',
  templateUrl: './action-list-presentation.component.html',
  styleUrls: ['./action-list-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionListPresentationComponent extends BaseComponent implements OnInit {

  @Input() actions: Action[];
  @Input() loading: boolean = false;
  @Output() deleteActionHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  deleteAction(action: Action): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${action.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteActionHandler.emit(action.id);
        }
      });
  }

  manageAction(action?: Action): void {
    this.dialog.open(ManageActionComponent, {
      width: '250px',
      data: Object.assign({}, action)
    });
  }
}
