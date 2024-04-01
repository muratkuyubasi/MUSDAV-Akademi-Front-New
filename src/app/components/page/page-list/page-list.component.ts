import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Page } from '@core/domain-classes/page';
import { BaseComponent } from 'src/app/base.component';
import { PageService } from '@core/services/page.service';
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslationService } from '@core/services/translation.service';
import { PageResource } from '@core/domain-classes/page-resource';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent extends BaseComponent implements OnInit {
  pages$: Observable<Page[]>;
  pagesFilter$: Observable<Page[]>;
  displayedColumns: string[] = ['action', 'name'];
  loading$: Observable<boolean>;

  constructor(
    private pageService: PageService,
    private toastrServoce: ToastrService,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.loading$ = this.pageService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getPages();
          }
        })
      );

    this.pages$ = this.pageService.entities$;
    this.pagesFilter$ = this.pageService.entities$;

  }

  deletePage(pageId: any) {
    this.sub$.sink = this.pageService.delete(pageId).subscribe(() => {
      this.toastrServoce.success(this.translationService.getValue('PAGE_DELETED_SUCCESSFULLY'));
    })
  }

  getPages(): void {
    this.pageService.getAll()
  }
  onFilterPage(pageResource: PageResource) {
    if (pageResource.name && pageResource.url) {
      this.pagesFilter$ = this.pages$.pipe(
        map(c =>
          c.filter(f => f.name.toLowerCase().lastIndexOf(pageResource.name.toLowerCase()) > -1 && f.url.toLowerCase().lastIndexOf(pageResource.url.toLowerCase()) > -1))
      );
    }
    else if (pageResource.name) {
      this.pagesFilter$ = this.pages$.pipe(
        map(c =>
          c.filter(f => f.name.toLowerCase().lastIndexOf(pageResource.name.toLowerCase()) > -1)
        ),
        tap(c => console.log(c))
      )
    }
    else if (pageResource.url) {
      this.pagesFilter$ = this.pages$.pipe(
        map(c =>
          c.filter(f => f.url.toLocaleUpperCase().lastIndexOf(pageResource.url.toLowerCase()) > -1 ))
      )
    }
    else {
      this.pagesFilter$ = this.pages$;
    }
  }
}
