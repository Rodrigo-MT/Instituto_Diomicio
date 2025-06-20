import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor() {
    // Pegue a key e iv do .env
    const keyEnv = process.env.ENCRYPTION_KEY || '';
    const ivEnv = process.env.ENCRYPTION_IV || '';

    if (keyEnv.length !== 32 || ivEnv.length !== 16) {
      throw new Error('Chave ou IV inválidos. ENCRYPTION_KEY deve ter 32 bytes e ENCRYPTION_IV 16 bytes.');
    }

    this.key = Buffer.from(keyEnv, 'utf-8');
    this.iv = Buffer.from(ivEnv, 'utf-8');
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
