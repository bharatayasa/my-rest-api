import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
@ApiProperty({ example: 'johndoe' })
    username: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'johndoe@example.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}