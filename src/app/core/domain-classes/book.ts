import { Author, BookAuthor, Contribute } from "./book-author";
import { BookTopic } from "./book-topic";
import { BookTopicTitle, LanguageAndAlphabet } from "./book-topic-title";

export interface Book {
  id?: string;
  name?: string;
  subName?: string;
  publishMediaType?: string;
  publishMedia?: string;
  isbn?: string;
  target?: string;
  subTarget?: string;
  topicId?: string;
  topicTitleId?: string;
  isTranslate?: boolean;
  translateAlphabetId?: string;
  translatedName?: string;
  publishedTime?: Date;
  printingReproduction?: string;
  printCount?: number;
  editions?: number;
  paperType?: string;
  skinType?: string;
  dimension?: string;
  pageCount?: number;
  cityId?: number;
  publisherName?: string;
  isVideoBook?: boolean;
  isAudioBook?: boolean;
  isEpub?: boolean;
  isActive?: boolean;
  createdDate?: Date;
  topic?: any;
  topicTitle?:any;
  languageAndAlphabet?:any;
  languageName?:string;
  alphabetName?:string;
  contributes?:Contribute[];
  bookAuthors?:BookAuthor[];
  authors?:Author[];
  bookVideos?:any[]
}
