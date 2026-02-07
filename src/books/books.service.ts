import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/books.entity';
import generateId from '../helper/generateId';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  findBooks(filterDto: GetBookFilterDto): Book[] {
    const {
      search,
      author,
      publication_date: publicationDate,
      language,
    } = filterDto;

    let filteredBooks = this.books;

    if (search) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (author) {
      filteredBooks = filteredBooks.filter(
        (book) => book.author.toLowerCase() === author.toLowerCase(),
      );
    }

    if (publicationDate) {
      filteredBooks = filteredBooks.filter(
        (book) => book.publicationDate === publicationDate,
      );
    }

    if (language) {
      filteredBooks = filteredBooks.filter(
        (book) => book.language === language,
      );
    }

    return filteredBooks;
  }

  findBookById(bookId: number) {
    const book = this.books.find((book) => book.id === bookId);

    if (!book) {
      throw new NotFoundException(`Book with id: ${bookId} not found!`);
    }

    return book;
  }

  createBook(data: CreateBookDto): Book {
    const book = {
      id: generateId(),
      ...data,
    };

    this.books.push(book);
    return book;
  }

  updateBook(bookId: number, updatedBook: UpdateBookDto) {
    const book = this.findBookById(bookId);
    Object.assign(book, updatedBook);
    return book;
  }

  deleteBook(bookId: number) {
    const index = this.books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      this.books.splice(index, 1);
      return { message: `Book with id: ${bookId} deleted!` };
    }
    throw new NotFoundException(`Book with id: ${bookId} not found!`);
  }
}
