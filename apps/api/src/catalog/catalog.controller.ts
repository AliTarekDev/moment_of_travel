import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, Roles } from '../common/auth.decorators';
import { UserRole } from '../users/user.entity';
import { CatalogQueryDto, CreateCatalogItemDto, UpdateCatalogItemDto } from './catalog.dto';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('public')
  @Public()
  findPublic(@Query() query: CatalogQueryDto) {
    return this.catalog.findPublic(query);
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
