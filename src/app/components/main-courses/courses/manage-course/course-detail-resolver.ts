import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { MainCoursesService } from '../../main-courses.service';


@Injectable()
export class CourseDetailResolverService implements Resolve<any> {
    constructor(private msService: MainCoursesService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('courseId');
        return this.msService.getCourse(id) as Observable<any>;
    }
}
