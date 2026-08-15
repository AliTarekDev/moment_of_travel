import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../common/auth.decorators';
import { UserRole } from '../users/user.entity';
import { ClientAttachmentKind } from './client.entity';
import { ClientsQueryDto, CreateClientDto, UpdateClientDto } from './clients.dto';
import { ClientsService } from './clients.service';

const clientRoles=[UserRole.ADMIN,UserRole.MANAGER,UserRole.RECEPTION];
@Controller('clients')
export class ClientsController {
  constructor(private readonly clients:ClientsService){}
  @Get() @Roles(...clientRoles) findAll(@Query() query:ClientsQueryDto){return this.clients.findAll(query);}
  @Get(':id') @Roles(...clientRoles) findOne(@Param('id') id:string){return this.clients.findOne(id);}
  @Post() @Roles(...clientRoles) create(@Body() dto:CreateClientDto){return this.clients.create(dto);}
  @Post('with-attachments') @Roles(...clientRoles) @UseInterceptors(FileFieldsInterceptor([{name:'passport',maxCount:1},{name:'national_id',maxCount:1},{name:'portrait',maxCount:1}],{limits:{fileSize:5*1024*1024}})) createComplete(@Body() dto:CreateClientDto,@UploadedFiles() files:Record<string,{buffer:Buffer;originalname:string;mimetype:string;size:number}[]>){return this.clients.createWithAttachments(dto,files);}
  @Patch(':id') @Roles(...clientRoles) update(@Param('id') id:string,@Body() dto:UpdateClientDto){return this.clients.update(id,dto);}
  @Delete(':id') @Roles(UserRole.ADMIN) remove(@Param('id') id:string){return this.clients.remove(id);}
  @Post(':id/attachments/:kind') @Roles(...clientRoles) @UseInterceptors(FileInterceptor('file',{limits:{fileSize:5*1024*1024}})) attach(@Param('id') id:string,@Param('kind') kind:ClientAttachmentKind,@UploadedFile() file:{buffer:Buffer;originalname:string;mimetype:string;size:number}){if(!['passport','national_id','portrait'].includes(kind))throw new BadRequestException('Invalid attachment kind');return this.clients.attach(id,kind,file);}
  @Get(':id/attachments/:kind') @Roles(...clientRoles) async attachment(@Param('id') id:string,@Param('kind') kind:ClientAttachmentKind,@Res() response:Response){const file=await this.clients.attachment(id,kind);response.setHeader('Content-Type',file.mime);response.setHeader('Content-Disposition',`inline; filename="${encodeURIComponent(file.name)}"`);response.setHeader('Cache-Control','private, no-store');response.send(file.data);}
}
