import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CatalogImageFile, CatalogImagesService } from './catalog-images.service';
import { Public, Roles } from '../common/auth.decorators';
import { UserRole } from '../users/user.entity';
import { CatalogQueryDto, CreateCatalogItemDto, UpdateCatalogItemDto } from './catalog.dto';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService, private readonly images: CatalogImagesService) {}

  @Post('images')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024, files: 1 } }))
  uploadImage(@UploadedFile() file?: CatalogImageFile) {
    return this.images.upload(file);
  }

  @Get('images/:name')
  @Public()
  async image(@Param('name') name: string, @Res() response: Response) {
    const file = await this.images.read(name);
    response.setHeader('Content-Type', file.mime);
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    response.send(file.data);
  }

  @Get('public')
  @Public()
  findPublic(@Query() query: CatalogQueryDto) {
    return this.catalog.findPublic(query);
  }

  @Get('public/tours/:slug')
  @Public()
  findPublicTour(@Param('slug') slug: string) {
    return this.catalog.findPublicTour(slug);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query() query: CatalogQueryDto) {
    return this.catalog.findAdmin(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.catalog.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateCatalogItemDto) {
    return this.catalog.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateCatalogItemDto) {
    return this.catalog.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.catalog.remove(id);
  }
}
