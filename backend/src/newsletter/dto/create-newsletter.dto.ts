import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsletterDto {
  @ApiProperty({ description: 'Email do assinante', example: 'usuario@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}