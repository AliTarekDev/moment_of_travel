import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser, Roles } from '../common/auth.decorators';
import { AuthUser } from '../common/auth-user';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTION, UserRole.ACCOUNTANT)
  findAll() {
    return this.users.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() currentUser: AuthUser) {
    return this.users.update(id, dto, currentUser.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.users.remove(id, currentUser.id);
  }
}
