// src/partners/dto/update-partners.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDto } from './create-partners.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiPropertyOptional({ description: 'Nome do parceiro' })
  nome?: string;

  @ApiPropertyOptional({ description: 'URL ou caminho da logo do parceiro' })
  logo?: string;

  @ApiPropertyOptional({ description: 'Descrição do parceiro' })
  descricao?: string;

  @ApiPropertyOptional({ description: 'URL do site oficial do parceiro' })
  site?: string;
}