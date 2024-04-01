import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { BaseComponent } from 'src/app/base.component';
import { ExamService } from './exam.service';


@Injectable()
export class ExamDetailsResolverService extends BaseComponent implements Resolve<any> {
    constructor(private examService: ExamService) {
        super()
     }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const id = route.paramMap.get('code');
        return this.examService.getExam(id,this.defaultLang$) as Observable<any>;
    }
}
