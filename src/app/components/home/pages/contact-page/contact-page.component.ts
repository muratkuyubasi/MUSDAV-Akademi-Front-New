import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {

  constructor(
    private _title:Title,
    private _meta:Meta
  ){
    this._title.setTitle("Eğitim Akademisi | Bize Ulaşın")
    this._meta.addTags([
      {
          "name": "keywords",
          "content":"Bize ulaşın"
      },
      {
          "name":"description",
          "content":"Eğitim Akademisi hakkında tüm soru ve görüşlerinizi bizimle paylaşabilirsiniz"
      },
      {
          "name":"author",
          "content":"Eğitim Akademisi"
      }
  ])
  }
}
