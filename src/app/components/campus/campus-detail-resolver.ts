import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CampusService } from './campus.service';

@Injectable()
export class CampusDetailResolverService implements Resolve<any> {
    constructor(private campusService: CampusService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('campusId');
        return this.campusService.getCampus(id) as Observable<any>;
    }
}
