import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from './course.service';
import { Course } from './course.model';

@Injectable()
export class CourseDetailResolverService implements Resolve<Course> {
    constructor(private courseService: CourseService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Course> {
        const id = route.paramMap.get('id');
        return this.courseService.getCourse(id) as Observable<Course>;
    }
}
