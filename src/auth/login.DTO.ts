import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({ example: 'bhar@example.com1' })
    email: string;

    @ApiProperty({ example: '123' })
    password: string;
}