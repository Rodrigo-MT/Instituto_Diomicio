// src/partners/partners.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partners.dto';
import { UpdatePartnerDto } from './dto/update-partners.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os parceiros' })
  @ApiResponse({ status: 200, description: 'Lista de parceiros retornada com sucesso.' })
  findAll() {
    return this.partnersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo parceiro' })
  @ApiResponse({ status: 201, description: 'Parceiro criado com sucesso.' })
  create(@Body() dto: CreatePartnerDto) {
    return this.partnersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um parceiro pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do parceiro' })
  @ApiResponse({ status: 200, description: 'Parceiro atualizado com sucesso.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePartnerDto) {
    return this.partnersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um parceiro pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do parceiro' })
  @ApiResponse({ status: 204, description: 'Parceiro removido com sucesso.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.remove(id);
  }
}