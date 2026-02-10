import {
  IsInt,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Language } from '../entities/books.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @IsDateString()
  @IsNotEmpty()
  publicationDate: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfPages: number;

  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
}
