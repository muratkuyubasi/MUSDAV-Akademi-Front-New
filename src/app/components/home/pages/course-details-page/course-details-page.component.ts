import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { BaseComponent } from 'src/app/base.component';
import { CourseService } from '../../services/course.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CartService } from '../../dashboard/cart/cart.service';


@Component({
    selector: 'app-course-details-page',
    templateUrl: './course-details-page.component.html',
    styleUrls: ['./course-details-page.component.scss']
})
export class CourseDetailsPageComponent extends BaseComponent implements OnInit {

    appUserAuth:UserAuth= null;
    course:any;
    courseRecord:any;
    userCourseCheck:any={
        isCourseRegister:false,
        isPayment:false,
        isRequiredPayment:false
    };
    isPayment:boolean = false;
    commentForm:UntypedFormGroup;
    commentMessage:any;
    showCommentForm:boolean=true;
    stars:any;
    studentComments:any[]=[];
    showLoadCount = 5;
    showLoadSkip = 0;
    
    constructor(
        private securityService:SecurityService,
        private activeRoute: ActivatedRoute,
        private route:Router,
        private courseService:CourseService,
        private fb:UntypedFormBuilder,
        private cartService:CartService,
        private _title:Title,
        private _meta:Meta
    ){
        super()
    }

    ngOnInit() {
        this.sub$.sink = this.activeRoute.data.subscribe(
            (data: { course: any }) => {
              if (data.course) {
                console.log(data.course)
                this._title.setTitle("Eğitim Akademisi | "+data.course.title)
                this._meta.addTags([
                    {
                        "name": "keywords",
                        "content":data.course.categoryName+", "+data.course.title
                    },
                    {
                        "name":"description",
                        "content":data.course.shortDescription
                    },
                    {
                        "name":"author",
                        "content":data.course.teacherFullName
                    }
                ])
                this.course = data.course;
                this.setTopLogAndName()
                this.createCommentForm()
                this.setCommentRating()
                this.setStudentComment()
              }
          });
    }

    createCommentForm(){
        this.commentForm = this.fb.group({
            studentId:[this.appUserAuth?.id],
            openedCourseId:[this.course?.id],
            title:['',Validators.required],
            comment:['',Validators.required],
            rating:['',Validators.required],
            isConfirmed:[false]
        })
    }

    saveComment(){
        if(this.commentForm.valid){
            const comment = this.createCommentObject()
            this.courseService.addStudentComment(comment).subscribe((resp:any)=>{
                console.log("YORUM", resp)
                if(resp.success){
                    this.commentMessage = "Yorumunuz yöneticilere iletimiştir. Onaylandıktan sonra yayınlanacaktır."
                    this.showCommentForm = false;
                }
            })
        }
        else{
            this.commentForm.markAllAsTouched()
        }
    }

    createCommentObject(){
        const comment = {
            studentId:this.appUserAuth?.id,
            openedCourseId:this.course?.id,
            title:this.commentForm.get('title').value,
            comment:this.commentForm.get('comment').value,
            rating:this.commentForm.get('rating').value,
            isConfirmed:false
        }

        return comment;
    }

    setCourseData(){
       this.courseRecord =  this.course.openedCourseRecords.filter(item=>item.languageCode === this.defaultLang$)[0]
    }

    setStudentComment(skip:number=-5,take:number=0){

         this.showLoadSkip =skip+5;
         this.showLoadCount =take+5;
        let comments = this.course.comments.comments
            for(let i = this.showLoadSkip; i<this.showLoadCount; i++){
                if(i<comments.length){
                    console.log(comments)
                    this.studentComments.push(comments[i])
                }
                else return
            }
    }
    setCommentRating(){

        let sumRating =0;


        let comment = this.course.comments;
        let totalRating =(comment.countFiveStar+comment.countFourStar+comment.countThreeStar+comment.countTwoStar+comment.countOneStar) 
        
        this.stars = {
            sumRating: 0,
            totalRating:totalRating,
            five:comment.countFiveStar,
            fivePercent: 0,
            four:comment.countFourStar,
            fourPercent: 0,
            three:comment.countThreeStar,
            threePercent: 0,
            two:comment.countTwoStar,
            twoPercent: 0,
            one:comment.countOneStar,
            onePercent: 0,
        }

        if(totalRating>0){
            sumRating = totalRating/5;
            this.stars = {
                sumRating: Math.ceil(sumRating),
                totalRating:totalRating,
                five:comment.countFiveStar,
                fivePercent: Math.round(comment.countFiveStar*100/totalRating),
                four:comment.countFourStar,
                fourPercent: Math.round(comment.countFourStar*100/totalRating),
                three:comment.countThreeStar,
                threePercent: Math.round(comment.countThreeStar*100/totalRating),
                two:comment.countTwoStar,
                twoPercent: Math.round(comment.countTwoStar*100/totalRating),
                one:comment.countOneStar,
                onePercent: Math.round(comment.countOneStar*100/totalRating),
            }
        }
    

        


    }

    addToCart(){
        let courseData = {
            id:this.course.id,
            courseName:this.course.title,
            coursePrice:this.course.coursePrice =="HOMEPAGE.FREE" ? 1 :this.course.coursePrice,
            quantity:1,
            currency:this.course.priceSymbol,
            code:this.course.code,
        }
        
        this.cartService.addToCart(courseData);
        // if(this.isUserCourse){
        //     this.route.navigate(['/dashboard/cart'])
        // }
        // else{
        //     this.route.navigate(['/register-course/',this.course.code,this.course.title])
        // }
    }
    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
   
        this.isOpen = false;
    }

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    // Accordion
    contentHeight: number = 0;
    openSectionIndex: number = -1;

    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
            this.calculateContentHeight();
        }
    }

    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }

    calculateContentHeight(): void {
        const contentElement = document.querySelector('.accordion-content');
        if (contentElement) {
            this.contentHeight = contentElement.scrollHeight;
        }
    }

    checkUserCourse(){
        this.courseService.checkUserCourse(this.appUserAuth.id,this.course.id).subscribe((resp:any)=>{
            console.log(resp);
            this.userCourseCheck = resp
        })
    }
    setTopLogAndName() {
        this.sub$.sink = this.securityService.securityObject$.subscribe(c => {
          if (c) {
            this.appUserAuth = c 
            this.checkUserCourse()
          }
          else{
            this.showCommentForm=false;
          }
        })
      }

}