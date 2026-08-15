import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientAttachmentKind } from './client.entity';
import { ClientsQueryDto, CreateClientDto, UpdateClientDto } from './clients.dto';

type UploadedFile={buffer:Buffer;originalname:string;mimetype:string;size:number};

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private readonly clients:Repository<Client>){}
  async findAll(query:ClientsQueryDto){const builder=this.clients.createQueryBuilder('client').orderBy('client.createdAt','DESC').skip((query.page-1)*query.limit).take(query.limit);if(query.search?.trim())builder.where('(client.fullName ILIKE :search OR client.mobile ILIKE :search OR client.email ILIKE :search OR client.passportNumber ILIKE :search)',{search:`%${query.search.trim()}%`});const[data,total]=await builder.getManyAndCount();return{data,meta:{page:query.page,limit:query.limit,total}};}
  async findOne(id:string){const client=await this.clients.findOneBy({id});if(!client)throw new NotFoundException('Client not found');return client;}
  async create(dto:CreateClientDto){await this.ensureUnique(dto);return this.clients.save(this.clients.create(this.clean(dto)));}
  async createWithAttachments(dto:CreateClientDto,files:Record<string,UploadedFile[]|undefined>){
    const passport=this.requiredFile(files['passport']?.[0],'passport');
    const nationalId=this.requiredFile(files['national_id']?.[0],'national ID');
    const portrait=this.requiredFile(files['portrait']?.[0],'portrait');
    await this.ensureUnique(dto);
    const client=this.clients.create({...this.clean(dto),passportImageName:passport.originalname.slice(0,120),passportImageMime:passport.mimetype,passportImageData:passport.buffer,nationalIdImageName:nationalId.originalname.slice(0,120),nationalIdImageMime:nationalId.mimetype,nationalIdImageData:nationalId.buffer,portraitImageName:portrait.originalname.slice(0,120),portraitImageMime:portrait.mimetype,portraitImageData:portrait.buffer});
    return this.clients.save(client);
  }
  async update(id:string,dto:UpdateClientDto){const client=await this.findOne(id);await this.ensureUnique(dto,id);Object.assign(client,this.clean(dto));return this.clients.save(client);}
  async remove(id:string){const client=await this.findOne(id);await this.clients.remove(client);return{deleted:true};}
  async attach(id:string,kind:ClientAttachmentKind,file?:UploadedFile){if(!file)throw new BadRequestException('Image file is required');if(!['image/jpeg','image/png','image/webp'].includes(file.mimetype))throw new BadRequestException('Only JPG, PNG and WebP images are allowed');if(file.size>5*1024*1024)throw new BadRequestException('Image must not exceed 5 MB');const client=await this.findOne(id);const prefix=kind==='passport'?'passportImage':kind==='national_id'?'nationalIdImage':'portraitImage';Object.assign(client,{[`${prefix}Name`]:file.originalname.slice(0,120),[`${prefix}Mime`]:file.mimetype,[`${prefix}Data`]:file.buffer});await this.clients.save(client);return this.findOne(id);}
  async attachment(id:string,kind:ClientAttachmentKind){const prefix=kind==='passport'?'passportImage':kind==='national_id'?'nationalIdImage':'portraitImage';const row=await this.clients.createQueryBuilder('client').addSelect(`client.${prefix}Data`).where('client.id = :id',{id}).getOne();if(!row)throw new NotFoundException('Client not found');const data=row[`${prefix}Data` as keyof Client] as Buffer|null;const mime=row[`${prefix}Mime` as keyof Client] as string|null;const name=row[`${prefix}Name` as keyof Client] as string|null;if(!data||!mime)throw new NotFoundException('Attachment not found');return{data,mime,name:name??'attachment'};}
  private clean(dto:CreateClientDto):Partial<Client>{return{...dto,fullName:dto.fullName.trim(),mobile:dto.mobile.trim(),whatsapp:dto.whatsapp?.trim()||null,email:dto.email?.trim()||null,nationality:dto.nationality.toUpperCase(),mahramName:dto.mahramName?.trim()||null,mahramRelationship:dto.mahramRelationship?.trim()||null,notes:dto.notes?.trim()||null,nationalId:dto.nationalId?.trim()||null,passportNumber:dto.passportNumber?.trim().toUpperCase()||null,passportExpiry:dto.passportExpiry||null};}
  private async ensureUnique(dto:CreateClientDto,ignoreId?:string){for(const [field,value] of [['nationalId',dto.nationalId?.trim()],['passportNumber',dto.passportNumber?.trim().toUpperCase()]] as const){if(!value)continue;const found=await this.clients.findOneBy({[field]:value});if(found&&found.id!==ignoreId)throw new ConflictException(`${field} is already registered`);}}
  private requiredFile(file:UploadedFile|undefined,label:string):UploadedFile{if(!file)throw new BadRequestException(`${label} image is required`);if(!['image/jpeg','image/png','image/webp'].includes(file.mimetype))throw new BadRequestException('Only JPG, PNG and WebP images are allowed');if(file.size>5*1024*1024)throw new BadRequestException('Image must not exceed 5 MB');return file;}
}
