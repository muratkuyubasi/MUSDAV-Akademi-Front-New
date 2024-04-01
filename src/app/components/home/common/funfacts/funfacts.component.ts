import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-funfacts',
    templateUrl: './funfacts.component.html',
    styleUrls: ['./funfacts.component.scss']
})
export class FunfactsComponent {

    constructor(
        public router: Router
    ) { }

    funfactBox = [
        {
            icon: `flaticon-document`,
            number: `750+`,
            title: `HOMEPAGE.COURSE`
        },
        {
            icon: `flaticon-skills`,
            number: `1000+`,
            title: `HOMEPAGE.STUDENT`
        },
        {
            icon: `flaticon-teacher`,
            number: `200+`,
            title: `HOMEPAGE.INSTRUCTOR`
        },
        {
            icon: `flaticon-tick`,
            number: `99%`,
            title: `HOMEPAGE.CUSTOMERHAPPINESS`
        }
    ]

}