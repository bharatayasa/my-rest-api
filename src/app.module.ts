import { PrismaService } from './../prisma/prisma.service';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { UsersController } from './users/users.controller';
import { BookController } from './book/book.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    BookModule,
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }), AuthModule,
  ],
  controllers: [ 
    UsersController, 
    BookController
  ],
  providers: [
    PrismaService, 
    JwtService
  ],
})
export class AppModule {}
