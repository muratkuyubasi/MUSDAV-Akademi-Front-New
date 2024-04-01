import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { BaseComponent } from 'src/app/base.component';
import { InstructorService } from '../instructor.service';


@Injectable()
export class InsCourseDetailsResolverService extends BaseComponent implements Resolve<any> {
    constructor(private insService: InstructorService) {
        super()
     }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('code');
        return this.insService.getCourse(id,this.defaultLang$) as Observable<any>;
    }
}
