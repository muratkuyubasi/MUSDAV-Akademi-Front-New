import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base.component';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent extends BaseComponent {
  
  constructor(
    private activeRoute:ActivatedRoute,
    private _title:Title,
    private _meta:Meta
  ){
    super()

        this._title.setTitle("Eğitim Akademisi | Hakkında")
        this._meta.addTags([
          {
              "name": "keywords",
              "content": "Eğitim Akademisi, Hakkında"
          },
          {
              "name": "description",
              "content": "Uzaktan Eğitim Akademisi, tüm alanlarda eğitim alma fırsatı sunan bir platformdur"
          }
      ] )
      
  }
}
