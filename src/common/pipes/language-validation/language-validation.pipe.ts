import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { Language } from 'src/books/entities/books.entity';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: CreateBookDto) {
    console.log('value', value);
    const languageValue = value.language;
    const supportedLanguages = [Language.FRENCH, Language.ENGLISH];
    if (!supportedLanguages.includes(languageValue)) {
      throw new BadRequestException('Unsupported language');
    }
    return value;
  }
}
