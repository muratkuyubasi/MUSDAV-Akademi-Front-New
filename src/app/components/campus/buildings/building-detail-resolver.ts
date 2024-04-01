import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CampusService } from '../campus.service';

@Injectable()
export class BuildingDetailResolverService implements Resolve<any> {
    constructor(private campusService: CampusService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('buildingId');
        return this.campusService.getBuilding(id) as Observable<any>;
    }
}
