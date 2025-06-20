import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiProperty({ description: 'Email de autenticação SMTP', example: 'smtpuser@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do email SMTP', example: 'senhaSegura123' })
  @IsNotEmpty()
  password: string;
}
