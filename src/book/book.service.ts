import { BadRequestException, Injectable, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core'
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>
  ) {}

  async findAll(query: Query): Promise<{data: Book[]; currentPage: number; perPage: number }> {

    // Create Pagination
    // URL books?page=2
    const perPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = perPage * (currentPage - 1)

    // Search By Keyword
    // URL books?keyword=Book 1
    const keyword = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    // Search by category
    // URL books?category=Adventure
    const category = query.category ? {
      category: query.category
    } : {}


    const books = await this.bookModel.find({ ...keyword, ...category}).limit(perPage).skip(skip)
    return {
      data: books,
      currentPage: currentPage,
      perPage: perPage
    }
  }


  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id})
    const res = await this.bookModel.create(data)
    return res
  }

  async findById(id: string): Promise<Book> {

    const isValidId = mongoose.isValidObjectId(id)
    if(!isValidId) {
      throw new BadRequestException('Please enter correct id.')
    }

    const book = await this.bookModel.findById(id)
    if(!book) {
      throw new NotFoundException('Book not found')
    }
    return book;
  }
  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id)
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true
    })
    
  }
}
