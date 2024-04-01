import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { BaseComponent } from 'src/app/base.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent extends BaseComponent implements OnInit {

  categories:any[]=[];
  tags:string[]=[];

  constructor(
    private courseService:CourseService,
    private _title:Title,
    private _meta:Meta
  ){
    super()
    
    this._title.setTitle("Eğitim Akademisi | Kategoriler")
  }

  ngOnInit(){
    this.getCategories();
  }

  getCategories(){

    const catImage = "assets/logo_transparent.png"

    this.courseService.getCategories().subscribe((resp:any)=>{

      resp.data.forEach(element => {
        console.log(this.defaultLang$)
        let cat = element.courseCategoryRecords.filter(item=>
          item.languageCode === this.defaultLang$
        )[0]
        this.categories.push({
          categoryPicture:element.categoryPicture ? element.categoryPicture :catImage,
          categoryName: cat.name,
          code:element.code,
          color:element.color,
          icon:element.icon,
          slug:cat.slug
        })

        this.tags.push(cat.name+", ");
        
      });
      
      this._meta.updateTag({ itemprop: 'keywords', content: "Kategoriler, "+this.tags.toString() });
     

    })
  }

}
