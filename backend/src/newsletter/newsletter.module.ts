import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterConfig } from './entities/newsletter-config.entity';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterConfigService } from './newsletter-config.service';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { EncryptionService } from '../utils/encryption';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterConfig, Newsletter])],
  controllers: [NewsletterController],
  providers: [NewsletterConfigService, NewsletterService, EncryptionService],
  exports: [NewsletterConfigService, NewsletterService],
})
export class NewsletterModule {}
