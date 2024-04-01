import { ResourceParameter } from './resource-parameter';

export class BookResource extends ResourceParameter {
  name: string = '';
  subname: string = '';
  isbn: string = '';
  author: string = '';
  publisherName:string ='';
  topic: string = '';
  isVideoBook: boolean = false;
  isAudioBook: boolean = false;
  isEpub: boolean = false;
  is_active: boolean = true;
}
