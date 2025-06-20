// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App') // Tag para categorizar no Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verificação da API', description: 'Retorna uma mensagem simples para verificar se o back-end está funcionando.' })
  @ApiResponse({ status: 200, description: 'Resposta padrão de verificação da API.', schema: { example: 'BACK-END' } })
  getHello(): string {
    return this.appService.getHello();
  }
}
