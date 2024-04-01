import { User } from "@core/domain-classes/user";

export interface Course {
    id?:number,
    categoryId?:number,
    code?:string,
    courseCategoryName?:string,
    title?:string,
    slug?:string,
    teacherId?:string,
    coursePicture?:string,
    coursePrice?:number,
    courseQuota?:number,
    description?:string,
    shortDescription?:string,
    isPopuler?:boolean,
    isPublish?:boolean,
    isRecommend?:boolean,
    user:User,
    courseSections?:CourseSection[]
}

export interface CourseSection {
    id?:number,
    code?:string,
    courseId?:number,
    title?:string,
    description?:string,
    lessons?:Lesson[]
}

export interface Lesson {
    id?:number,
    code?:string,
    isPublish?:boolean,
    description?:string,
    liveLessonUrl?:string,
    sectionId?:number,
    title?:string,
    videoPath?:string,
    videoUrl?:string,
    lessonFiles:LessonFiles[]
}

export interface LessonFiles {
    id?:number,
    code?:string,
    title?:string,
    created?:Date,
    filePath?:string,
    fileType?:string,
    isPublish?:boolean,
    lessonId?:number

}