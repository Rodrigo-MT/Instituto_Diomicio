import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionService } from '../utils/encryption';
import { Repository } from 'typeorm';
import { NewsletterConfig } from './entities/newsletter-config.entity';

@Injectable()
export class NewsletterConfigService {
  constructor(
    @InjectRepository(NewsletterConfig)
    private readonly configRepo: Repository<NewsletterConfig>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async getConfig() {
    // Aqui passamos um objeto vazio dentro de "where" para buscar o primeiro registro
    const config = await this.configRepo.findOne({ where: {} });
    if (!config) return {};
    return { email: this.encryptionService.decrypt(config.email) };
  }

  async getDecryptedPassword(): Promise<string | null> {
    const config = await this.configRepo.findOne({ where: {} });
    if (!config || !config.password) return null;
    return this.encryptionService.decrypt(config.password);
  }

  async saveConfig(email: string, password: string) {
    const encryptedEmail = this.encryptionService.encrypt(email);
    const encryptedPassword = this.encryptionService.encrypt(password);
    let config = await this.configRepo.findOne({ where: {} });

    if (config) {
      config.email = encryptedEmail;
      config.password = encryptedPassword;
    } else {
      config = this.configRepo.create({ email: encryptedEmail, password: encryptedPassword });
    }

    await this.configRepo.save(config);
    return { success: true };
  }
}
