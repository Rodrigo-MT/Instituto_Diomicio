// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { ProductsModule } from '../products/products.module';
import { NoticesModule } from '../notices/notices.module';
import { PartnersModule } from '../partners/partners.module';


@Module({
  imports: [
    // Torna variáveis de ambiente disponíveis em toda a aplicação
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configura o TypeORM com base nas variáveis do .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Desative em produção!
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    EventsModule,
    NewsletterModule,
    ProductsModule,
    NoticesModule,
    PartnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
