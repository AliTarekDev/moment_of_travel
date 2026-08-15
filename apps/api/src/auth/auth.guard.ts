import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/auth.decorators';
import { AuthUser } from '../common/auth-user';
import { readCookie } from '../common/cookie';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const token = readCookie(request.headers.cookie, 'mot_session');
    if (!token) throw new UnauthorizedException('Authentication required');

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token);
      const user = await this.users.findById(payload.sub);
      if (!user.active) throw new UnauthorizedException('User account is inactive');
      request.user = { id: user.id, email: user.email, role: user.role, fullName: user.fullName };
      return true;
    } catch {
      throw new UnauthorizedException('Session is invalid or expired');
    }
  }
}
