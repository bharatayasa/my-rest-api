import { Injectable } from '@nestjs/common';
import { User, role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {} 

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            where: ({
                deletedAt: null,
            })
        });
    }

    async findOne(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { 
                id,
                deletedAt: null,
            }
        });
    }

    async createUser(data: { email: string; password: string; role?: role; username: string; name: string }): Promise<User> { 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        return this.prisma.user.create({
            data: {
                email: data.email, 
                password: hashedPassword,
                role: data.role || role.user,
                username: data.username,
                name: data.name,
            },
        });
    }

    async updateUser(id: number, data: { email?: string; password?: string; role?: role; username?: string; name?: string }): Promise<User | null> {
        let hashedPassword: string | undefined;
    
        if (data.password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(data.password, saltRounds);
        }
    
        return this.prisma.user.update({
            data: {
                username: data.username,
                name: data.name, 
                email: data.email, 
                password: hashedPassword ? hashedPassword : undefined,
                role: data.role || role.user,
            },
            where: { id },
        });
    }

    async softDeleteUser(id: number): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async restoreData(id: number): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: null,
            },
        });
    }
}
