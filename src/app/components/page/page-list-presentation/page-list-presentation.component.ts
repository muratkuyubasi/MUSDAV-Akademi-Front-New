import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { BaseComponent } from 'src/app/base.component';
import { Page } from '@core/domain-classes/page';
import { ManagePageComponent } from '../manage-page/manage-page.component';
import { TranslationService } from '@core/services/translation.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { KeyValueType } from '@core/domain-classes/key-value-type';
import { PageResource } from '@core/domain-classes/page-resource';

@Component({
  selector: 'app-page-list-presentation',
  templateUrl: './page-list-presentation.component.html',
  styleUrls: ['./page-list-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListPresentationComponent extends BaseComponent implements OnInit {

  @Input() pages: Page[];
  @Input() loading: boolean;
  @Output() deletePageHandler: EventEmitter<string> = new EventEmitter<string>();
  @Output() filter: EventEmitter<PageResource> = new EventEmitter<PageResource>();
  nameFilterCtl: UntypedFormControl = new UntypedFormControl(['']);
  urlFilterCtl: UntypedFormControl = new UntypedFormControl(['']);
  keyValue: KeyValueType[] = [];
  pageResource: PageResource;
  displayedColumns: string[] = ['action', 'name', 'url'];

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService
  ) {
    super();
    this.pageResource = new PageResource();
  }

  ngOnInit(): void {
    this.sub$.sink = this.nameFilterCtl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(c => {
        this.pageResource.name = c;
        this.filter.emit(this.pageResource);
      });
      this.sub$.sink = this.urlFilterCtl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(c => {
        this.pageResource.url = c;
        this.filter.emit(this.pageResource);
      })
  }

  deletePage(page: Page): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${page.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deletePageHandler.emit(page.id);
        }
      });
  }

  managePage(page?: Page): void {
    this.dialog.open(ManagePageComponent, {
      width: '250px',
      data: Object.assign({}, page)
    });
  }
}
