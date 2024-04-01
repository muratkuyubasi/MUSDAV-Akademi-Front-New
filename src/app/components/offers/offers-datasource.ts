import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { OfferResource } from '@core/domain-classes/offer-resources';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { OfferService } from './offers.service';


export class OfferDataSource implements DataSource<any> {
    private offerSubject = new BehaviorSubject<any[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;


    public get count(): number {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private offerService: OfferService) { }

    connect(): Observable<any[]> {
        return this.offerSubject.asObservable();
    }

    disconnect(): void {
        this.offerSubject.complete();
        this.loadingSubject.complete();
    }

    loadOffers(offerResource: OfferResource) {
        this.loadingSubject.next(true);
        this.offerService.getOffers(offerResource).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<any[]>) => {
                const paginationParam = JSON.parse(
                    resp.headers.get('X-Pagination')
                ) as ResponseHeader;
                this.responseHeaderSubject.next(paginationParam);
                const offers = [...resp.body];

                this._count = offers.length;
                this.offerSubject.next(offers);
            });
    }
}
