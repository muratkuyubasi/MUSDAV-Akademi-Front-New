export interface Author{
    id?:string;
    authorName?:string;
    typeName?:string;
    countryName?:string;
    institutionName?:string;
}

export interface BookAuthor {
    bookId?:string;
    authorId?:string;
    author?:Author;
}

export interface Contribute {
    id?:string;
    fullName?:string;
    typeName?:string;
}