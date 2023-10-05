import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  // GET books[]
  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<{data: Book[]; currentPage: number; perPage: number}> {
    return this.bookService.findAll(query)
  }

  // GET books/:id
  @Get(':id')
  async getBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.findById(id)
  }

  // PUT books/:id
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() book: UpdateBookDto): Promise<Book> {
    return this.bookService.updateById(id, book)
  }

  // DELETE books/:id
  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.deleteById(id)
  }

  // POST books
  @Post()
  async createBook(@Body() book: CreateBookDto): Promise<Book> {
    return this.bookService.create(book)
  }
}