import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { filter, map, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject } from 'rxjs';
import { TranslationService } from '@core/services/translation.service';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MainCoursesService } from '../../main-courses.service';

@Component({
    selector: 'app-category-list',
    templateUrl: 'category-list.component.html'
})

export class CategoryListComponent extends BaseComponent implements OnInit {
    selectedLang:string;
    displayedColumns: string[] = ['name', 'action'];

    dataSource = new MatTableDataSource();
    constructor(
        private coursesService:MainCoursesService,
        private translationService: TranslationService,
        private router:Router,
        private commonDialogService:CommonDialogService,
        private toastrService:ToastrService
    ) {
        super()
     }

    ngOnInit() { 
        this.getAllCategories()   
    }

    getAllCategories(){
        this.coursesService.getAllCategory().subscribe((resp:any)=>{
            this.dataSource = new MatTableDataSource(resp.data)

        })
    }

    deletePage(category: any): void {
        let name = category.courseCategoryRecords.filter(item=>item.languageCode == this.defaultLang$)[0].name
        this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${name}`)
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.sub$.sink = this.coursesService.deleteCategory(category.code)
              .subscribe(() => {
                this.toastrService.success(this.translationService.getValue('DELETED_SUCCESSFULLY'));
                this.getAllCategories()
              });
          }
        });
      }
    
      managePage(category?: any): void {
        this.router.navigate(['/admin/courses/manage-category', category.code])
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}