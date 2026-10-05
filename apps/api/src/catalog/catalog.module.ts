import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogItem } from './catalog-item.entity';
import { CatalogService } from './catalog.service';
import { CatalogImagesService } from './catalog-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogItem])],
  controllers: [CatalogController],
  providers: [CatalogService, CatalogImagesService],
})
export class CatalogModule {}
