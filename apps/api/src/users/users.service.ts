import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User, UserRole } from './user.entity';

export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.users.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findForAuthentication(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.users.existsBy({ email: dto.email });
    if (exists) throw new ConflictException('A user with this email already exists');

    const user = this.users.create({
      fullName: dto.fullName.trim(),
      email: dto.email,
      passwordHash: await hash(dto.password, 12),
      role: dto.role,
    });
    return this.users.save(user);
  }

  async update(id: string, dto: UpdateUserDto, actorId: string): Promise<User> {
    const user = await this.findById(id);

    if (id === actorId && (dto.active === false || (dto.role && dto.role !== UserRole.ADMIN))) {
      throw new ConflictException('You cannot deactivate or remove administrator access from your current account');
    }

    const removesActiveAdmin =
      user.role === UserRole.ADMIN &&
      user.active &&
      (dto.active === false || (dto.role !== undefined && dto.role !== UserRole.ADMIN));
    if (removesActiveAdmin) {
      const activeAdminCount = await this.users.countBy({ role: UserRole.ADMIN, active: true });
      if (activeAdminCount <= 1) {
        throw new ConflictException('The last active administrator cannot be deactivated or assigned another role');
      }
    }

    if (dto.email && dto.email !== user.email) {
      const emailOwner = await this.users.findOneBy({ email: dto.email });
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    if (dto.fullName !== undefined) user.fullName = dto.fullName.trim();
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.active !== undefined) user.active = dto.active;
    return this.users.save(user);
  }

  async remove(id: string, actorId: string): Promise<{ deleted: true }> {
    if (id === actorId) {
      throw new ConflictException('You cannot delete your own account');
    }

    const user = await this.findById(id);
    if (user.role === UserRole.ADMIN && user.active) {
      const activeAdminCount = await this.users.countBy({ role: UserRole.ADMIN, active: true });
      if (activeAdminCount <= 1) {
        throw new ConflictException('The last active administrator cannot be deleted');
      }
    }

    await this.users.remove(user);
    return { deleted: true };
  }
}
