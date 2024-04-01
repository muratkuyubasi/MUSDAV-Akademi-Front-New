import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

    constructor(
        public router: Router
    ) { }

    featuresContent = [
        {
            image1: `assets/images/banner/sync6.jpg`,
            image2: `assets/images/banner/ftf1.jpg`,
            image3: `assets/images/banner/async6.jpg`,
            title: `HOMEPAGE.ABOUT_TITLE`,
            paragraph: `HOMEPAGE.ABOUT_DESCRIPTION`,
            list: [
                {
                    title: `HOMEPAGE.FACETOFACE`
                },
                {
                    title: `HOMEPAGE.SYNCHRON`
                },
                {
                    title: `HOMEPAGE.ASYNCHRON`
                },
                {
                    title: `HOMEPAGE.FIND_TAKE_LESSON`
                }
            ],
            buttonText: `HOMEPAGE.GET_STARTED_NOW`,
            buttonLink: `/courses`
        }
    ]
    featuresText = [
        {
            image1: `assets/images/features/feature4.jpg`,
            image2: `assets/images/features/feature5.jpg`,
            title: `Affordable Online Courses And Learning Opportunities`,
            paragraph: `It is a long established fact that a reader will be distracted by the readable contenwhen looking at its layout. The point of using Lorem Ipsum is that it has.`,
            list: [
                {
                    title: `Flexible Classes`
                },
                {
                    title: `Offline Mode`
                },
                {
                    title: `Educator Support`
                },
                {
                    title: `Flexible Learning`
                }
            ],
            buttonText: `View All Stories`,
            buttonLink: `/stories`
        }
    ]

}