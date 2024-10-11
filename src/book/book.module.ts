import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  providers: [BookService],
  controllers: [BookController], 
  exports: [BookService]
})
export class BookModule {}
