import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '@core/domain-classes/book';
import { Author,Contribute } from '@core/domain-classes/book-author';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { VideoBookService } from '@core/services/video-book.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';


@Component({
  selector: 'app-manage-video-book',
  templateUrl: './manage-video-book.component.html',
  styleUrls: ['./manage-video-book.component.scss']
})
export class ManageVideoBookComponent extends BaseComponent implements OnInit {
  book: Book;
  bookForm: UntypedFormGroup;
  isbnSearchFilterCtl: UntypedFormControl = new UntypedFormControl('');
  isEditMode = false;
  isSearch = false;
  searchMessage:any="";
  bookVideo?:any;
  showPermission:boolean=false;

  readingHistory:any[]=[];

  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private bookService: VideoBookService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private translationService:TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.createbookForm();
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { book: Book }) => {
        if (data.book) {
          this.isEditMode = true;
          
          this.getBookVideo(data.book.id)
          if(data.book.languageAndAlphabet !=null){
            data.book.alphabetName = data.book.languageAndAlphabet.alphabetName;
            data.book.languageName = data.book.languageAndAlphabet?.languageName;
          }
          if(data.book.topic !=null){
            data.book.topic = data.book.topic.title
            // this.book.topicTitle = data.book.languageAndAlphabet?.AlphabetName;
            // this.book.languageName = data.book.languageAndAlphabet?.languageName;
          }
          if(data.book.topicTitle !=null){
            data.book.topicTitle = data.book.topicTitle.title

            // this.book.topicTitle = data.book.languageAndAlphabet?.AlphabetName;
            // this.book.languageName = data.book.languageAndAlphabet?.languageName;
          }
          
          this.bookForm.patchValue(data.book);
          this.bookForm.get('contributes').patchValue(data.book.contributes)
          if(data.book.authors?.length>0){
            for(let i=0; i<data.book.authors.length; i++){
              this.bookAuthors.push(
                this.fb.group({
                  authorName: [data.book.authors[i].authorName],
                  institutionName: [data.book.authors[i].institutionName],
                  typeName: [data.book.authors[i].typeName]
                })
              );
            }
          }
          
          if(data.book.contributes?.length>0){
            for(let i=0; i<data.book.contributes.length; i++){
              this.bookContributes.push(
                this.fb.group({
                  fullName: [data.book.contributes[i].fullName],
                  typeName: [data.book.contributes[i].typeName]
                })
              );
            }
          }
          this.book = data.book;
        } 
    });
      this.filterLogic();
  }

  filterLogic() {
    this.sub$.sink = this.bookForm.get('isbn').valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(c => {
      if(c.length>9 && c.length<14){
        this.getBookFromIsbn(c)
      }

    });
  }
  getBookFromIsbn(isbn){
    this.isSearch = true;
    this.searchMessage ="ISBN servisinden kontrol ediliyor. Lütfen Bekleyiniz..."
    this.bookForm.disable()
    this.bookService.getBookFromIsbn(isbn).subscribe((resp:any)=>{
      this.bookForm.enable()
      if(resp !=null){
        if(resp !=null){
          if(resp.statusCode==100){
            this.searchMessage = "Kitap Veritabanında bulundu"
            this.toastrService.show("Kitap Veritabanında bulundu")
            this.router.navigate(['/admin/video-book/manage/'+resp.data.id]);
          }
          else{
            this.isSearch = false;
            this.searchMessage ="Kitap bilgileri ISBN servisinden getirildi"
            resp.isbn = resp.isbn.replaceAll("-","")
            this.bookForm.reset();
            this.bookAuthors.clear();
            this.bookContributes.clear()
            this.bookForm.patchValue(resp);
            if(resp.authors?.length>0){
              for(let i=0; i<resp.authors.length; i++){
                this.bookAuthors.push(
                  this.fb.group({
                    authorName: [resp.authors[i].authorName],
                    institutionName: [resp.authors[i].institutionName],
                    typeName: [resp.authors[i].typeName]
                  })
                );
              }
            }
            
            if(resp.contributes?.length>0){
              for(let i=0; i<resp.contributes.length; i++){
                this.bookContributes.push(
                  this.fb.group({
                    fullName: [resp.contributes[i].fullName],
                    typeName: [resp.contributes[i].typeName]
                  })
                );
              }
            }
          }
          
        }
        
      }
      else{
        this.bookForm.enable()
        this.searchMessage = "Kitap ISBN servisinde bulunamadı"
        this.isSearch=false;
        this.toastrService.error("Kitap ISBN servisinde bulunamadı")
      }

    })
  }

  createbookForm() {
    this.bookForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      target: ['', [Validators.required]],
      isbn: ['', [Validators.required, Validators.pattern(new RegExp(/^(\d{13})$/))]],
      isTranslate:[false],
      publishMediaType:[''],
      publishMedia:[''],
      pageCount:[''],
      paperType:[''],
      printCount:[''],
      dimension:[''],
      editions:[''],
      printingReproduction:[''],
      publishedTime:[''],
      publisherName:[''],
      skinType:[''],
      subName:[''],
      subTarget:[''],
      languageName:[''],
      alphabetName:[''],
      languageAndAlphabet:[''],
      topic:[''],
      topicTitle:[''],
      translatedName:[''],
      isActive: [true],
      isVideoBook: [true],
      isAudioBook: [false],
      isEpub: [false],
      bookCover: [false],
      contributes:this.fb.array([]),
      bookAuthors: this.fb.array([])
    });
  } 


  get bookAuthors():UntypedFormArray{
    return this.bookForm.get("bookAuthors") as UntypedFormArray
  }

  newAuthors(fullName:string="",typeName:string=""): UntypedFormGroup {
    return this.fb.group({
      authorName: [''],
      typeName: [''],
      institutionName:['']
    })
  }

  addAuthor() {
    this.bookAuthors.push(this.newAuthors());
  }

  removeAuthor(i: number) {
    this.bookAuthors.removeAt(i);
  }

  get bookContributes():UntypedFormArray{
    return this.bookForm.get("contributes") as UntypedFormArray
  }

  newContributes(fullName:string="",typeName:string=""): UntypedFormGroup {
    return this.fb.group({
      fullName: [''],
      typeName: ['']
    })
  }

  addContribute() {
    this.bookContributes.push(this.newContributes());
  }

  removeContribute(i: number) {
    this.bookContributes.removeAt(i);
  }
  saveBook() {
    if (this.bookForm.valid) {
       const book = this.createBuildObject();
      if (this.isEditMode) {
        this.sub$.sink = this.bookService.updateBook(book).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('BOOK_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/admin/video-book']);
        });
      } else {
        this.sub$.sink = this.bookService.addBook(book).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('BOOK_CREATED_SUCCESSFULLY'));
          this.router.navigate(['/admin/video-book']);
        });
      }
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  createBuildObject(): Book {
    
    const bookId = this.bookForm.get('id').value;
    const book: Book = {
      id: bookId,
      name: this.bookForm.get('name').value,
      target: this.bookForm.get('target').value,
      isbn: this.bookForm.get('isbn').value,
      isTranslate:this.bookForm.get('isTranslate').value,
      publishMediaType:this.bookForm.get('publishMediaType').value,
      publishMedia:this.bookForm.get('publishMedia').value,
      pageCount:this.bookForm.get('pageCount').value,
      paperType:this.bookForm.get('paperType').value,
      printCount:this.bookForm.get('printCount').value,
      dimension:this.bookForm.get('dimension').value,
      editions:this.bookForm.get('editions').value,
      printingReproduction:this.bookForm.get('printingReproduction').value,
      publishedTime:this.bookForm.get('publishedTime').value,
      publisherName:this.bookForm.get('publisherName').value,
      skinType:this.bookForm.get('skinType').value,
      subName:this.bookForm.get('subName').value,
      subTarget:this.bookForm.get('subTarget').value,
      languageName:this.bookForm.get('languageName').value,
      alphabetName:this.bookForm.get('alphabetName').value,
      languageAndAlphabet:this.bookForm.get('languageAndAlphabet').value,
      topic:this.bookForm.get('topic').value,
      topicTitle:this.bookForm.get('topicTitle').value,
      translatedName:this.bookForm.get('translatedName').value,
      isActive: this.bookForm.get('isActive').value,
      isVideoBook: true,
      isAudioBook: false,
      isEpub: false,
      contributes:(this.bookContributes.value as Contribute[]),
      authors: (this.bookAuthors.value as Author[])
    }
    return book;
  }


  getBookVideo(id){
    this.bookService.getBookVideo(id).subscribe((resp:any)=>{
      if(resp.id!="00000000-0000-0000-0000-000000000000"){
        this.showPermission = true;
        // this.bookVideoForm.patchValue(resp)
        this.bookVideo = resp;

        // this.videoSources =[
        //   {
        //     src: resp.mediaFile,
        //     type:'video/mp4'
        //   }
        // ];
        // this.vimeoSources =[
        //   {
        //     src: resp.vimeoId,
        //     provider: 'vimeo',
        //   }]
      }
      else{
        this.toastrService.error("Henüz Video Eklenmemiş")
      }
    })
  }


  


}
