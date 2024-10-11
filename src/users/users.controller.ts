import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { role } from '@prisma/client';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import * as moment from 'moment';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll();

            console.log("ini data user", users);

            if (!users || users.length === 0) { 
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "User data not found", 
                    data: users
                });
            }

            const formatData = users.map(user => ({
                id: user.id, 
                email: user.email,
                role: user.role, 
                createdAt: moment(user.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(user.updatedAt).format('YYYY-MM-DD'),
            }))

            return res.status(HttpStatus.OK).json({
                message: "Success to get all user data", 
                data: formatData
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }

    @Get(':id')
    async getUser(@Param('id') id: number, @Res() res: Response) {
        try {
            const user = await this.usersService.findOne(Number(id));

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'data not found',
                    data: user
                });
            }

            const formatData = {
                id: user.id, 
                email: user.email,
                role: user.role, 
                createdAt: moment(user.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(user.updatedAt).format('YYYY-MM-DD'),
            }

            return res.status(HttpStatus.OK).json({
                message: "success to get data by id",
                data: formatData
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }

    @Post()
    async addUsers(@Body() body: { email: string; password: string; role?: role }, @Res() res: Response) {
        try {
            const newUser = await this.usersService.createUser(body)

            const formatData = {
                id: newUser.id, 
                email: newUser.email,
                role: newUser.role, 
                createdAt: moment(newUser.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(newUser.updatedAt).format('YYYY-MM-DD'),
            }

            return res.status(HttpStatus.CREATED).json({
                message: "User created successfully", 
                data: formatData
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'failed to create user',
                error: error.message,
            });
        }
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() body: { email?: string; password?: string; role?: role },
        @Res() res: Response
    ) {
        try {
            const numericId = Number(id);

            if (isNaN(numericId)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Invalid ID format",
                });
            }

            const updatedUser = await this.usersService.updateUser(numericId, body);

            const formatData = {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: moment(updatedUser.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(updatedUser.updatedAt).format('YYYY-MM-DD'),
            };

            return res.status(HttpStatus.OK).json({
                message: "User updated successfully",
                data: formatData
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to update user',
                error: error.message,
            });
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Res() res: Response) {
        try {
            const numericId = Number(id);

            if (isNaN(numericId)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Invalid ID format",
                });
            }

            const deletedUser = await this.usersService.deleteUser(numericId);

            const formatData = {
                id: deletedUser.id,
                email: deletedUser.email,
                role: deletedUser.role,
                createdAt: moment(deletedUser.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(deletedUser.updatedAt).format('YYYY-MM-DD'),
            };

            return res.status(HttpStatus.OK).json({
                message: "User deleted successfully", 
                data: formatData
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'failed to delete user',
                error: error.message,
            });
        }
    }
}
