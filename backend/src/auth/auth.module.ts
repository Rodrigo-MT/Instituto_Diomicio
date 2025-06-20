// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Importa variáveis de ambiente
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        /**
         * ATENÇÃO:
         * -------------------------
         * Em ambiente de PRODUÇÃO, NÃO use o .env para armazenar segredos como JWT_SECRET.
         * 
         * Utilize um serviço de gerenciamento de segredos seguro, como:
         * - AWS Secrets Manager
         * - HashiCorp Vault
         * - Azure Key Vault
         * - Google Secret Manager
         * 
         * Implemente a integração para buscar o segredo dinamicamente aqui.
         * 
         * Exemplo (AWS SDK):
         * const secret = await secretsManager.getSecretValue({ SecretId: 'jwt-secret' }).promise();
         * const jwtSecret = JSON.parse(secret.SecretString).JWT_SECRET;
         * 
         * return {
         *   secret: jwtSecret,
         *   signOptions: { expiresIn: '1h' },
         * };
         */

        // Em desenvolvimento, lê do .env normalmente
        secret: configService.get<string>('JWT_SECRET'), // JWT_SECRET no .env
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
