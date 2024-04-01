import { ResourceParameter } from './resource-parameter';

export class ExamResource extends ResourceParameter {
  title: string = '';
  isActive:string = '';
  userId:string = '';
  languageCode:string="tr"
}


export class ExamQuestionResource extends ResourceParameter {
  questionText: string = '';
  examId:number=0
  isActive:string = '';
  questionCode:string = '';
  userId:string = '';
  languageCode:string="tr"
}
