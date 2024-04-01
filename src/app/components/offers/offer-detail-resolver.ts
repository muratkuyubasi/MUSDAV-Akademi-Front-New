import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { OfferService } from './offers.service';

@Injectable()
export class OfferDetailResolverService implements Resolve<any> {
    constructor(private offerService: OfferService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('id');
        return this.offerService.getOffer(id) as Observable<any>;
    }
}
