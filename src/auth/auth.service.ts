import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(data: { username: string; name: string; email: string; password: string; }): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await this.prisma.user.create({
            data: {
                username: data.username,
                name: data.name,
                email: data.email,
                password: hashedPassword,
            }
        });

        return newUser;
    }

    async login(email: string, password: string): Promise<{ access_token: string }> {

        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { id: user.id, email: user.email, role: user.role };

            const access_token = this.jwtService.sign(payload, {
                secret: jwtSecret,
            });

        return { access_token };
    }
}
