import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';
import { Course } from '../course.model';
import { CourseService } from '../course.service';
import { CourseResource } from '../course-resource';

export class CourseDataSource implements DataSource<Course> {
    private courseSubject = new BehaviorSubject<Course[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;


    public get count(): number {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private courseService: CourseService) { }

    connect(): Observable<Course[]> {
        return this.courseSubject.asObservable();
    }

    disconnect(): void {
        this.courseSubject.complete();
        this.loadingSubject.complete();
    }

    loadBooks(courseResource: CourseResource) {
        this.loadingSubject.next(true);
        this.courseService.getCourses(courseResource).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<Course[]>) => {
                const paginationParam = JSON.parse(
                    resp.headers.get('X-Pagination')
                ) as ResponseHeader;
                this.responseHeaderSubject.next(paginationParam);
                const courses = [...resp.body];
                this._count = courses.length;
                this.courseSubject.next(courses);
            });
    }
}
