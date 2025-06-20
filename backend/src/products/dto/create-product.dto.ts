import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ description: 'Preço do produto' })
  @IsOptional()
  @IsNumber()
  preco?: number;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiPropertyOptional({ description: 'Caminho local da imagem armazenada' })
  @IsOptional()
  @IsString()
  imagePath?: string;
}