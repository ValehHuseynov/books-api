import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Language } from '../entities/books.entity';

export class GetBookFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsDateString()
  @IsOptional()
  publication_date?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}
