import { ResourceParameter } from "@core/domain-classes/resource-parameter";

export class CourseResource extends ResourceParameter {
  code: string = '';
  isFree: boolean = false;
  allCourse: boolean = true;
  isRecommended: boolean = false;
  isPopular: boolean = false;
  isActive: boolean = true;
  title:string = "";
  teacher:string = "";
  categoryName:string = "";
}
