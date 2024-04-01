import { ResourceParameter } from './resource-parameter';

export class OfferResource extends ResourceParameter {
  title: string = '';
  offerStatus:string = '1';
  courseTypeId:string = '';
  userId:string = '';
  keyword:string=''
  isActive:string='1'
}
