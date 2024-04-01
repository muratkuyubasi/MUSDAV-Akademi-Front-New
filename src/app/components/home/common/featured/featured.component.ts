import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-featured',
    templateUrl: './featured.component.html',
    styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent {

    constructor(
        public router: Router
    ) { }

    featuredBox = [
        {
            icon: `assets/images/featured/icon1.gif`,
            title: `HOMEPAGE.LEARN_ALL_FIELD`
        },
        {
            icon: `assets/images/featured/icon2.gif`,
            title: `HOMEPAGE.WHETHER_FACETOFACE`
        },
        {
            icon: `assets/images/featured/icon3.gif`,
            title: `HOMEPAGE.WHETHER_ONLINE`
        },
        {
            icon: `assets/images/featured/icon4.gif`,
            title: `HOMEPAGE.EDUCATION_PLATFORM`
        }
    ]

}