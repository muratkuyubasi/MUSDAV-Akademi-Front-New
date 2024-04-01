import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: 'reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
    constructor(
        private router:ActivatedRoute
    ) {
        this.router.params.subscribe(param=>{
            console.log(param)
        })
     }

    ngOnInit() { }
}