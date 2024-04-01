import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { BaseComponent } from 'src/app/base.component';


@Injectable()
export class StudentCourseDetailResolverService extends BaseComponent implements Resolve<any> {
    constructor(private courseService: CourseService) {
        super()
     }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('code');

        return this.courseService.getStudentCourse(id,this.defaultLang$) as Observable<any>;
    }
}
