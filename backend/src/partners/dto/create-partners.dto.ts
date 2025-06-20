// src/partners/dto/create-partners.dto.ts
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Nome do parceiro' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'URL da logo do parceiro' })
  @IsNotEmpty()
  @IsString()
  logo: string;

  @ApiProperty({ description: 'Descrição do parceiro' })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'URL do site oficial do parceiro' })
  @IsNotEmpty()
  @IsUrl()
  site: string;
}