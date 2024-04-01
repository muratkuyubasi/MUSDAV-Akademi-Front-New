import { ResourceParameter } from './resource-parameter';

export class HomePageCourseResource extends ResourceParameter {
  title: string = '';
  courseType:string = '';
  categoryName:string = '';
  categorySlug:string = '';
  courseSlug:string = '';
  isPopuler: string = '';
  isRecommend: string = '';
  isPublish: string = '1';
  isConfirmed: string = '1';
}
