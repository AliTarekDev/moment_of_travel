import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ClientGender { MALE='male', FEMALE='female' }
export enum MaritalStatus { SINGLE='single', MARRIED='married', DIVORCED='divorced', WIDOWED='widowed' }
export type ClientAttachmentKind = 'passport' | 'national_id' | 'portrait';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 160 }) fullName!: string;
  @Column({ length: 40 }) mobile!: string;
  @Column({ type:'varchar', length:40, nullable:true }) whatsapp!: string|null;
  @Column({ type:'varchar', length:180, nullable:true }) email!: string|null;
  @Column({ length:2 }) nationality!: string;
  @Column({ type:'date' }) birthDate!: string;
  @Column({ type:'varchar', length:10 }) gender!: ClientGender;
  @Column({ type:'varchar', length:15 }) maritalStatus!: MaritalStatus;
  @Column({ type:'varchar', length:160, nullable:true }) mahramName!: string|null;
  @Column({ type:'varchar', length:100, nullable:true }) mahramRelationship!: string|null;
  @Column({ type:'text', nullable:true }) notes!: string|null;
  @Column({ type:'varchar', length:30, nullable:true, unique:true }) nationalId!: string|null;
  @Column({ type:'varchar', length:30, nullable:true, unique:true }) passportNumber!: string|null;
  @Column({ type:'date', nullable:true }) passportExpiry!: string|null;

  @Column({ type:'varchar', length:120, nullable:true }) passportImageName!: string|null;
  @Column({ type:'varchar', length:80, nullable:true }) passportImageMime!: string|null;
  @Column({ type:'bytea', nullable:true, select:false }) passportImageData!: Buffer|null;
  @Column({ type:'varchar', length:120, nullable:true }) nationalIdImageName!: string|null;
  @Column({ type:'varchar', length:80, nullable:true }) nationalIdImageMime!: string|null;
  @Column({ type:'bytea', nullable:true, select:false }) nationalIdImageData!: Buffer|null;
  @Column({ type:'varchar', length:120, nullable:true }) portraitImageName!: string|null;
  @Column({ type:'varchar', length:80, nullable:true }) portraitImageMime!: string|null;
  @Column({ type:'bytea', nullable:true, select:false }) portraitImageData!: Buffer|null;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
