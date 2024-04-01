import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'SubSink';

@Component({
    selector: 'app-base',
    template: ``
})
export class BaseComponent implements OnDestroy {
    sub$: SubSink;
    defaultLang$:any;
    meta$:any;

    constructor(
    ) {
        this.sub$ = new SubSink();
        this.defaultLang$ = localStorage.getItem("language");
    }
    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }

}
