import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';

@Injectable()
export class BookService {
    constructor (private prisma: PrismaService){}

    async findAll(): Promise<Book[]>{
        return this.prisma.book.findMany()
    }
}
