import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { DashboardService } from '../dashboard.service';
import { SlugifyPipe } from 'ngx-pipes';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],

})
export class ReviewsComponent extends BaseComponent implements OnInit {

  isEditMode:boolean=false;
  selectedComment:0;
  comments:any[]=[]
  commentForm:UntypedFormGroup;
  constructor(
    private dashboardService:DashboardService,
    private fb:UntypedFormBuilder
  ){
    super()
    this.createCommentForm()
  }

  ngOnInit(): void {
    this.getComments()
  }

  createCommentForm(){
    this.commentForm = this.fb.group({
      id:[''],
      title:[''],
      comment:[''],
      openedCourseId:[''],
      isConfirmed:[false],
      studentId:['']
    })
  }


  getComments(){
    this.dashboardService.getAllStudentComments().subscribe(resp=>{
      this.comments = resp.data;
      console.log(resp)
    })
  }

  updateComment(comment){

    this.commentForm.patchValue(comment);
    this.isEditMode = !this.isEditMode
    this.selectedComment = comment.id

    console.log(this.commentForm.value)
  }

  saveComment(){
    const comment = this.commentForm.value;
    this.dashboardService.updateStudentComment(comment).subscribe(resp=>{
      this.isEditMode = false;
      this.getComments()
    })
  }

  deleteComment(id){
    this.dashboardService.deleteStudentComments(id).subscribe(resp=>{
     this.getComments()
    })
  }
}
