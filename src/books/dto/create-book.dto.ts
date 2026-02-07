import { Language } from '../entities/books.entity';

export class CreateBookDto {
  title: string;
  author: string;
  publicationDate: string;
  numberOfPage: number;
  language: Language;
}