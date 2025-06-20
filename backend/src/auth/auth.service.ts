import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private adminUsername: string;
  private hashedPassword: string;

  private loginAttempts = new Map<string, { count: number; blockedUntil?: number }>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const hashedPassword = this.configService.get<string>('ADMIN_PASSWORD_HASH');

    if (!adminUsername || !hashedPassword) {
      throw new Error('ADMIN_USERNAME ou ADMIN_PASSWORD_HASH não configuradas');
    }

    this.adminUsername = adminUsername;
    this.hashedPassword = hashedPassword;
  }

  async validateUser(username: string, password: string): Promise<any> {
    // Checa se usuário está bloqueado temporariamente
    const attempts = this.loginAttempts.get(username) ?? { count: 0 };
    if (attempts.blockedUntil && Date.now() < attempts.blockedUntil) {
      throw new UnauthorizedException('Usuário bloqueado temporariamente por muitas tentativas falhas.');
    }

    // Faz a verificação normal de usuário e senha
    const isMatch = await bcrypt.compare(password, this.hashedPassword);
    if (username === this.adminUsername && isMatch) {
      // Sucesso: reseta contador
      this.loginAttempts.delete(username);
      return { userId: 1, username, role: 'admin' };
    }

    // Falha no login: incrementa contador
    attempts.count++;
    if (attempts.count >= this.MAX_ATTEMPTS) {
      attempts.blockedUntil = Date.now() + this.BLOCK_TIME_MS;
    }
    this.loginAttempts.set(username, attempts);

    return null;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
