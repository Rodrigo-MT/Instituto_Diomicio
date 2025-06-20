import {
  Controller, Get, Post, Body, Put, Param, Delete, UploadedFile, UseInterceptors, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import {
  ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Eventos')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const isValid = allowedTypes.test(file.mimetype);
      cb(null, isValid);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Criação de um novo evento. O envio da imagem é opcional.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Evento de Música' },
        date: { type: 'string', format: 'date-time', example: '2025-07-01T20:00:00Z' },
        location: { type: 'string', example: 'Centro de Eventos - SP' },
        description: { type: 'string', example: 'Um grande show ao vivo.' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Imagem do evento (JPEG ou PNG, até 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Criar novo evento (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/${file.filename}` : undefined;
    return this.eventsService.create(createEventDto, imagePath);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos retornada com sucesso.' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID numérico do evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const isValid = allowedTypes.test(file.mimetype);
      cb(null, isValid);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Atualização dos dados de um evento. A imagem é opcional.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Evento Atualizado' },
        date: { type: 'string', format: 'date-time', example: '2025-07-10T20:00:00Z' },
        location: { type: 'string', example: 'Auditório Municipal' },
        description: { type: 'string', example: 'Descrição atualizada.' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Nova imagem do evento (JPEG ou PNG)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Atualizar evento existente (apenas ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do evento a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/${file.filename}` : undefined;
    return this.eventsService.update(id, updateEventDto, imagePath);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Excluir evento por ID (apenas ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do evento a ser removido' })
  @ApiResponse({ status: 200, description: 'Evento removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
