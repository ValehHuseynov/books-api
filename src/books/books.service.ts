import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  private books: Book[] = [];

  async findBooks(filterDto: GetBookFilterDto) {
    const { search, publication_date: publicationDate, language } = filterDto;

    const query = this.bookRepository.createQueryBuilder('book');

    if (search) {
      query.andWhere('(book.title LIKE :search OR book.author LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (publicationDate) {
      query.andWhere('(book.publicationDate = :publicationDate)', {
        publicationDate,
      });
    }

    if (language) {
      query.andWhere('(book.language = :language)', { language });
    }

    const books = await query.getMany();
    return books;
  }

  async findBookById(bookId: number) {
    const book = await this.bookRepository.findOneBy({ id: bookId });

    if (!book) {
      throw new NotFoundException(`Book with id: ${bookId} not found!`);
    }

    return book;
  }

  createBook(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async updateBook(bookId: number, updatedBook: UpdateBookDto) {
    const book = await this.bookRepository.preload({
      id: bookId,
      ...updatedBook,
    });

    if (!book) {
      throw new NotFoundException(`Book with id: ${bookId} not found!`);
    }

    return this.bookRepository.save(book);
  }

  async deleteBook(bookId: number) {
    const book = await this.bookRepository.findOneBy({ id: bookId });

    if (!book) {
      throw new NotFoundException(`Book with id: ${bookId} not found!`);
    }

    return this.bookRepository.remove(book);
  }
}
