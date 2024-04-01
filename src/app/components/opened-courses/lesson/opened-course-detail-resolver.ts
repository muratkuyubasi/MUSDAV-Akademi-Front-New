import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { OpenedCoursesService } from '../opened-courses.service';


@Injectable()
export class LessonDetailResolverService implements Resolve<any> {
    constructor(private osService: OpenedCoursesService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('lessonId');
        return this.osService.getOpenedCourseLesson(id) as Observable<any>;
    }
}
