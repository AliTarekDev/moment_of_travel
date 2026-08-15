import { BadRequestException,Body,Controller,Delete,Get,Param,Post,Query,Res,UploadedFiles,UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Roles } from '../common/auth.decorators';
import { UserRole } from '../users/user.entity';
import { ProgramImageKind } from './program.entity';
import { CreateProgramDto,ProgramsQueryDto } from './programs.dto';
import { ProgramsService } from './programs.service';
const programRoles=[UserRole.ADMIN,UserRole.MANAGER];
@Controller('programs')
export class ProgramsController{
  constructor(private readonly programs:ProgramsService){}
  @Get() @Roles(...programRoles) findAll(@Query()query:ProgramsQueryDto){return this.programs.findAll(query);}
  @Get(':id') @Roles(...programRoles) findOne(@Param('id')id:string){return this.programs.findOne(id);}
  @Post() @Roles(...programRoles) @UseInterceptors(FileFieldsInterceptor([{name:'cover',maxCount:1},{name:'social',maxCount:1}],{limits:{fileSize:5*1024*1024}})) create(@Body()dto:CreateProgramDto,@UploadedFiles()files:Record<string,{buffer:Buffer;originalname:string;mimetype:string;size:number}[]>){return this.programs.create(dto,files);}
  @Delete(':id') @Roles(UserRole.ADMIN) remove(@Param('id')id:string){return this.programs.remove(id);}
  @Get(':id/images/:kind') @Roles(...programRoles) async image(@Param('id')id:string,@Param('kind')kind:ProgramImageKind,@Res()response:Response){if(!['cover','social'].includes(kind))throw new BadRequestException('Invalid image kind');const image=await this.programs.image(id,kind);response.setHeader('Content-Type',image.mime);response.setHeader('Content-Disposition',`inline; filename="${encodeURIComponent(image.name)}"`);response.setHeader('Cache-Control','private, max-age=300');response.send(image.data);}
}
