import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../users/user.entity';
import { AuthUser } from './auth-user';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<Request & { user: AuthUser }>();
    return request.user;
  },
);
