import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { AuthUser } from '../common/auth-user';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ token: string; user: AuthUser }> {
    const user = await this.users.findForAuthentication(dto.email);
    if (!user || !user.active || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return {
      token: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }),
      user: safeUser,
    };
  }
}
