import { AuthService } from './auth/auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { UsersController } from './users/users.controller';
import { BookController } from './book/book.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    BookModule,
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [ 
    UsersController, 
    BookController, 
    AuthController,
  ],
  providers: [
    PrismaService, 
    AuthService,
    JwtService
  ],
})
export class AppModule {}
