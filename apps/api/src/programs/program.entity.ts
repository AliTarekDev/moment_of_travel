import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ProgramType { HAJJ='hajj', UMRAH='umrah' }
export enum ServiceLevel { ECONOMY='economy', STANDARD='standard', PREMIUM='premium', VIP='vip' }
export enum ProgramStatus { DRAFT='draft', PUBLISHED='published', ARCHIVED='archived' }
export type ProgramImageKind='cover'|'social';

@Entity({name:'programs'})
export class Program{
  @PrimaryGeneratedColumn('uuid') id!:string;
  @Column({length:180}) name!:string;
  @Column({type:'varchar',length:15}) type!:ProgramType;
  @Column({length:100}) season!:string;
  @Column({type:'varchar',length:15}) serviceLevel!:ServiceLevel;
  @Column({type:'varchar',length:15,default:ProgramStatus.DRAFT}) status!:ProgramStatus;
  @Column({type:'date'}) departureDate!:string;
  @Column({type:'date'}) returnDate!:string;
  @Column({type:'varchar',length:80,nullable:true}) ministryPermitNumber!:string|null;
  @Column({type:'varchar',length:180,nullable:true}) makkahHotel!:string|null;
  @Column({type:'smallint',nullable:true}) makkahHotelRating!:number|null;
  @Column({type:'smallint',nullable:true}) makkahNights!:number|null;
  @Column({type:'varchar',length:180,nullable:true}) madinahHotel!:string|null;
  @Column({type:'smallint',nullable:true}) madinahHotelRating!:number|null;
  @Column({type:'smallint',nullable:true}) madinahNights!:number|null;
  @Column({type:'varchar',length:160,nullable:true}) airline!:string|null;
  @Column({type:'varchar',length:60,nullable:true}) flightNumber!:string|null;
  @Column({type:'decimal',precision:12,scale:2,nullable:true}) singlePrice!:string|null;
  @Column({type:'decimal',precision:12,scale:2,nullable:true}) doublePrice!:string|null;
  @Column({type:'decimal',precision:12,scale:2,nullable:true}) triplePrice!:string|null;
  @Column({type:'decimal',precision:12,scale:2,nullable:true}) quadruplePrice!:string|null;
  @Column({type:'decimal',precision:12,scale:2,nullable:true}) seatCashCost!:string|null;
  @Column({type:'integer'}) totalSeats!:number;
  @Column({default:false}) includesMeals!:boolean;
  @Column({default:false}) includesVisits!:boolean;
  @Column({type:'text',nullable:true}) description!:string|null;
  @Column({type:'varchar',length:70,nullable:true}) seoTitle!:string|null;
  @Column({type:'varchar',length:180,nullable:true}) metaDescription!:string|null;
  @Column({type:'text',nullable:true}) canonicalUrl!:string|null;
  @Column({type:'varchar',length:120}) coverImageName!:string;
  @Column({type:'varchar',length:80}) coverImageMime!:string;
  @Column({type:'bytea',select:false}) coverImageData!:Buffer;
  @Column({type:'varchar',length:120,nullable:true}) socialImageName!:string|null;
  @Column({type:'varchar',length:80,nullable:true}) socialImageMime!:string|null;
  @Column({type:'bytea',select:false,nullable:true}) socialImageData!:Buffer|null;
  @CreateDateColumn() createdAt!:Date;
  @UpdateDateColumn() updatedAt!:Date;
}
