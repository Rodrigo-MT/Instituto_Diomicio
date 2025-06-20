import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ForbiddenException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReorderNoticesDto } from './dto/reorder-notice.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notícias')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias', description: 'Retorna todas as notícias ordenadas por prioridade.' })
  @ApiResponse({ status: 200, description: 'Lista de notícias retornada com sucesso.' })
  findAll() {
    return this.noticesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar notícias', description: 'Atualiza a ordem de exibição das notícias.' })
  @ApiResponse({ status: 200, description: 'Ordem atualizada com sucesso.' })
  reorder(@Body() reorderDto: ReorderNoticesDto) {
    return this.noticesService.reorder(reorderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova notícia', description: 'Cria uma nova notícia se o link ainda não existir.' })
  @ApiResponse({ status: 201, description: 'Notícia criada com sucesso.' })
  @ApiResponse({ status: 409, description: 'Conflito: notícia com o mesmo link já existe.' })
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar notícia', description: 'Atualiza os dados de uma notícia específica pelo ID.' })
  @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(id, updateNoticeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover notícia', description: 'Remove uma notícia do sistema pelo ID.' })
  @ApiResponse({ status: 200, description: 'Notícia removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('seed')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Popular com notícias pré-definidas', description: 'Insere um conjunto fixo de notícias caso ainda não existam.' })
  @ApiResponse({ status: 201, description: 'Notícias pré-definidas inseridas.' })
  @ApiResponse({ status: 409, description: 'Notícias já foram criadas anteriormente.' })
  async seed() { // ← Remova o parâmetro do token
    const alreadyExists = await this.noticesService.findPreload();
    if (alreadyExists.length > 0) {
      throw new ConflictException('Notícias já foram criadas.');
    }
  
    return this.noticesService.seedPredefined();
  }
}
