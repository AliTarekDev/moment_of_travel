import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  RECEPTION = 'reception',
  ACCOUNTANT = 'accountant',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  fullName!: string;

  @Column({ unique: true, length: 180 })
  email!: string;

  @Column({ select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RECEPTION })
  role!: UserRole;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
