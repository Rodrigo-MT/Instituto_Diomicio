import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionService } from '../utils/encryption';
import { Newsletter } from './entities/newsletter.entity';
import { Repository } from 'typeorm';
import { NewsletterConfigService } from './newsletter-config.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly configService: NewsletterConfigService,
    @InjectRepository(Newsletter)
    private readonly newsletterRepo: Repository<Newsletter>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async getAllSubscribers() {
    const all = await this.newsletterRepo.find();
    return all.map((sub) => ({
      id: sub.id,
      email: this.encryptionService.decrypt(sub.email),
      subscribedAt: sub.subscribedAt,
    }));
  }

  async testSMTP(email: string, password: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: email, pass: password },
    });

    try {
      await transporter.verify();
    } catch (err) {
      throw new BadRequestException('Falha ao autenticar com SMTP. Verifique email e senha.');
    }
  }

  async subscribe(email: string) {
    const encryptedEmail = this.encryptionService.encrypt(email);
    const existing = await this.newsletterRepo.findOne({ where: { email: encryptedEmail } });
    if (existing) {
      throw new BadRequestException('Email já inscrito.');
    }
    const subscriber = this.newsletterRepo.create({ email: encryptedEmail });
    await this.newsletterRepo.save(subscriber);
    return { message: 'Inscrito com sucesso!' };
  }

  async sendEmails(subject: string, content: string, recipients: string[]) {
    const config = await this.configService.getConfig();
    const password = await this.configService.getDecryptedPassword();

    if (!config.email || !password) {
      throw new BadRequestException('Configuração de e-mail não definida.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: config.email, pass: password },
    });

    // Os destinatários no frontend virão descriptografados (emails reais)
    // Se quiser pode criptografar no front e descriptografar aqui, mas
    // mais simples (e seguro) enviar descriptografados e não guardar email
    // descriptografado no banco, apenas criptografado.

    const mailOptions = {
      from: config.email,
      to: recipients,
      subject,
      html: content,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Erro ao enviar email: ' + error.message);
    }
  }
}
