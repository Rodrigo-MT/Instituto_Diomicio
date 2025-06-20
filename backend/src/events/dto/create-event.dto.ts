import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Feira de coleta de latinhas', description: 'Nome do evento' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-08-15T19:30:00Z', description: 'Data e hora do evento em formato ISO 8601' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Parque de Exposições - SC', description: 'Local do evento' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'Evento voltado para coleta de latinhas', description: 'Descrição opcional do evento' })
  @IsOptional()
  @IsString()
  description?: string;
}
