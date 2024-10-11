import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ UsersController, AuthController],
  providers: [],
})
export class AppModule {}
