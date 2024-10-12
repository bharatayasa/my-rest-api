import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(
        @Body() body: { username: string; name: string; email: string; password: string },
        @Res() res: Response
    ) {
        try {
            const newUser = await this.authService.register(body);
            return res.status(HttpStatus.CREATED).json({
                message: 'User registered successfully',
                data: newUser,
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
        @Body() body: { email: string; password: string },
        @Res() res: Response
    ) {
        try {
            const { access_token } = await this.authService.login(body.email, body.password);
            return res.status(HttpStatus.OK).json({
                message: 'Login successful',
                access_token
            });
        } catch (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'Login failed',
                error: error.message,
            });
        }
    }
}
