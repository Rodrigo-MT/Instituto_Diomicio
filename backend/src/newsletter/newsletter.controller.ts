import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { NewsletterService } from './newsletter.service';
import { NewsletterConfigService } from './newsletter-config.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly configService: NewsletterConfigService,
  ) {}

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todos os assinantes da newsletter' })
  @ApiResponse({ status: 200, description: 'Lista de assinantes retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getSubscribers() {
    return this.newsletterService.getAllSubscribers();
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Cadastrar email como assinante' })
  @ApiBody({ type: CreateNewsletterDto })
  @ApiResponse({ status: 201, description: 'Email cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Email inválido.' })
  async subscribe(@Body() body: CreateNewsletterDto) {
    return this.newsletterService.subscribe(body.email);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar newsletter para lista de emails' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de emails para envio da newsletter',
        },
        subject: { type: 'string', description: 'Assunto da newsletter' },
        message: { type: 'string', description: 'Conteúdo da newsletter' },
      },
      required: ['emails', 'subject', 'message'],
    },
  })
  @ApiResponse({ status: 201, description: 'Newsletter enviada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async sendNewsletter(
    @Body() body: { emails: string[]; subject: string; message: string },
  ) {
    return this.newsletterService.sendEmails(body.subject, body.message, body.emails);
  }

  @Get('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter configuração do serviço de newsletter' })
  @ApiResponse({ status: 200, description: 'Configuração retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getConfig() {
    return this.configService.getConfig();
  }

  @Post('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Salvar configuração do serviço de newsletter' })
  @ApiBody({ type: UpdateConfigDto })
  @ApiResponse({ status: 201, description: 'Configuração salva com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async saveConfig(@Body() body: UpdateConfigDto) {
    await this.newsletterService.testSMTP(body.email, body.password);
    return this.configService.saveConfig(body.email, body.password);
  }
}
