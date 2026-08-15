import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CurrentUser, Public } from '../common/auth.decorators';
import { AuthUser } from '../common/auth-user';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto);
    response.cookie('mot_session', result.token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/',
    });
    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('mot_session', { path: '/' });
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser): { user: AuthUser } {
    return { user };
  }
}
