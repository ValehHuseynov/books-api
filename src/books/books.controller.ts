import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookFilterDto } from './dto/get-book-filter.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AccessControlGuard } from '../auth/guards/access-control.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/entities/user.entity';

@UseGuards(AuthGuard, AccessControlGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles(Role.ADMIN, Role.VIEWER)
  findAll(@Query() filterDto: GetBookFilterDto) {
    return this.booksService.findBooks(filterDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findBookById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateBookDto) {
    return this.booksService.createBook(body);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto) {
    const book = this.booksService.updateBook(id, body);
    return book;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
