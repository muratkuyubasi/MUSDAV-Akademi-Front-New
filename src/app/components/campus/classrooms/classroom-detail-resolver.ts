import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CampusService } from '../campus.service';

@Injectable()
export class ClassroomDetailResolverService implements Resolve<any> {
    constructor(private campusService: CampusService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('classroomId');
        return this.campusService.getClassroom(id) as Observable<any>;
    }
}
