import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as moment from 'moment';
import { RegisterDTO } from './register.DTO';
import { LoginDTO } from './login.DTO';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(
        @Body() body: RegisterDTO,
        @Res() res: Response
    ) {
        try {
            const newUser = await this.authService.register(body);

            const formatData = {
                username: newUser.username,
                name: newUser.name, 
                email: newUser.email,
                role: newUser.role, 
                createdAt: moment(newUser.createdAt).format('YYYY-MM-DD'),
            }

            return res.status(HttpStatus.CREATED).json({
                message: 'User registered successfully',
                data: formatData,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to register user',
                error: error.message,
            });
        }
    }

    @Post('login')
    async login(
        @Body() body: LoginDTO,
        @Res() res: Response
    ) {
        try {
            const { access_token } = await this.authService.login(body);
            return res.status(HttpStatus.OK).json({
                message: 'Login successful',
                data: {
                    token: access_token
                }
            });
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'Login failed',
                error: error.message,
            });
        }
    }
}
