import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';

function editFileName(
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExt = extname(file.originalname);
  callback(null, `${uniqueSuffix}${fileExt}`);
}

class CreateProductDtoWithFile {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  imagem?: any;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty({ required: false })
  preco?: number;
}

class UpdateProductDtoWithFile {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  imagem?: any;

  @ApiProperty({ required: false })
  nome?: string;

  @ApiProperty({ required: false })
  descricao?: string;

  @ApiProperty({ required: false })
  preco?: number;
}

@ApiTags('products')
@ApiBearerAuth() // <--- Adicionado para Swagger saber que o controller usa Bearer token
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDtoWithFile })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const dto: CreateProductDto = {
      nome: body.nome,
      descricao: body.descricao,
      preco: body.preco ? parseFloat(body.preco) : undefined,
      imagePath: file ? `/uploads/${file.filename}` : undefined,
    };
    return await this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada' })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: Number })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID do produto', type: Number })
  @ApiBody({ type: UpdateProductDtoWithFile })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: UpdateProductDto = {
      nome: body.nome,
      descricao: body.descricao,
      preco: body.preco ? parseFloat(body.preco) : undefined,
    };
    if (file) {
      dto.imagePath = `/uploads/${file.filename}`;
    }
    return await this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: Number })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { message: `Produto ${id} removido` };
  }
}
