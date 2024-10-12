import { Controller, Res, HttpStatus, Get } from '@nestjs/common';
import { BookService } from './book.service';
import { Response } from 'express';
import * as moment from 'moment';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService){}

    @Get()
    async getBooks(@Res() res: Response) {
        try {
            const books = await this.bookService.findAll()

            if (!books || books.length === 0) { 
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "Book data not found", 
                    data: books
                });
            }

            const formatBook = books.map(book => ({
                title: book.title, 
                content: book.content, 
                authorid: book.authorId,
                createdAt: moment(book.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(book.updatedAt).format('YYYY-MM-DD'),
            }))

            return res.status(HttpStatus.OK).json({
                message: "Succes to get all books data", 
                data: formatBook
            })

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }
}
