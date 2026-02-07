import { Language } from '../entities/books.entity';

export class GetBookFilterDto {
  search?: string;
  author?: string;
  publication_date?: string;
  language?: Language;
}
