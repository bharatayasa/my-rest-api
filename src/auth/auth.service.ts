import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
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
        console.log("JWT_SECRET dari .env", process.env.JWT_SECRET);
    
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
    
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        console.log("data users", user);
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        console.log("password valid:", isPasswordValid);
    
        const payload = { id: user.id, email: user.email, role: user.role };
    
        console.log("payload :", payload);
    
        try {
            const access_token = this.jwtService.sign(payload);
            console.log("akses token :", access_token);
            return { access_token };
        } catch (error) {
            console.error("Error saat membuat access token:", error);
            throw new UnauthorizedException('Failed to generate access token');
        }
    }
}
