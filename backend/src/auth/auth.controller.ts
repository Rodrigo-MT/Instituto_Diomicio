import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth') // Agrupa os endpoints sob a tag 'auth' no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local')) // Usa a estratégia local (usuário + senha)
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica o usuário usando nome de usuário e senha. Retorna um token JWT em caso de sucesso.',
  })
  @ApiBody({
    description: 'Credenciais de login',
    type: LoginDto,
    examples: {
      exemplo: {
        summary: 'Login de administrador',
        value: {
          username: 'admin',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Retorna um token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
  }
}
