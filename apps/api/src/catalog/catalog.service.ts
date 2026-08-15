import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { CatalogQueryDto, CreateCatalogItemDto, UpdateCatalogItemDto } from './catalog.dto';
import { CatalogItem, CatalogStatus } from './catalog-item.entity';

@Injectable()
export class CatalogService {
  constructor(@InjectRepository(CatalogItem) private readonly items: Repository<CatalogItem>) {}

  findPublic(query: CatalogQueryDto) {
    return this.findMany({ ...query, status: CatalogStatus.PUBLISHED }, false);
  }

  findAdmin(query: CatalogQueryDto) {
    return this.findMany(query, true);
  }

  async findOne(id: string): Promise<CatalogItem> {
    const item = await this.items.findOneBy({ id });
    if (!item) throw new NotFoundException('Catalog item not found');
    return item;
  }

  async create(dto: CreateCatalogItemDto): Promise<CatalogItem> {
    this.validateDates(dto.startDate, dto.endDate);
    const slug = dto.slug?.trim() || (await this.uniqueSlug(dto.titleEn));
    if (await this.items.existsBy({ slug })) throw new ConflictException('Slug is already used');
    return this.items.save(this.items.create(this.cleanPayload(dto, slug)));
  }

  async update(id: string, dto: UpdateCatalogItemDto): Promise<CatalogItem> {
    const item = await this.findOne(id);
    this.validateDates(dto.startDate, dto.endDate);
    const slug = dto.slug?.trim() || item.slug;
    if (slug !== item.slug && (await this.items.existsBy({ slug }))) {
      throw new ConflictException('Slug is already used');
    }
    Object.assign(item, this.cleanPayload(dto, slug));
    return this.items.save(item);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const item = await this.findOne(id);
    await this.items.remove(item);
    return { deleted: true };
  }

  private async findMany(query: CatalogQueryDto, includeStatusFilter: boolean) {
    const builder = this.items
      .createQueryBuilder('item')
      .orderBy('item.featured', 'DESC')
      .addOrderBy('item.sortOrder', 'ASC')
      .addOrderBy('item.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.division) builder.andWhere('item.division = :division', { division: query.division });
    if (query.type) builder.andWhere('item.type = :type', { type: query.type });
    if (includeStatusFilter && query.status) builder.andWhere('item.status = :status', { status: query.status });
    if (!includeStatusFilter) builder.andWhere('item.status = :status', { status: CatalogStatus.PUBLISHED });
    if (query.search?.trim()) {
      builder.andWhere('(item.titleAr ILIKE :search OR item.titleEn ILIKE :search OR item.slug ILIKE :search)', {
        search: `%${query.search.trim()}%`,
      });
    }
    const [data, total] = await builder.getManyAndCount();
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  private cleanPayload(dto: CreateCatalogItemDto, slug: string): Partial<CatalogItem> {
    return {
      ...dto,
      slug,
      titleAr: dto.titleAr.trim(),
      titleEn: dto.titleEn.trim(),
      summaryAr: dto.summaryAr.trim(),
      summaryEn: dto.summaryEn.trim(),
      descriptionAr: dto.descriptionAr?.trim() || null,
      descriptionEn: dto.descriptionEn?.trim() || null,
      locationAr: dto.locationAr?.trim() || null,
      locationEn: dto.locationEn?.trim() || null,
      imageUrl: dto.imageUrl?.trim() || null,
      price: dto.price === undefined || dto.price === null ? null : dto.price.toFixed(2),
      currency: dto.currency?.toUpperCase() || 'SAR',
      startDate: dto.startDate || null,
      endDate: dto.endDate || null,
      featured: dto.featured ?? false,
      sortOrder: dto.sortOrder ?? 0,
      status: dto.status ?? CatalogStatus.DRAFT,
    };
  }

  private validateDates(startDate?: string, endDate?: string): void {
    if (startDate && endDate && endDate < startDate) {
      throw new BadRequestException('endDate must be on or after startDate');
    }
  }

  private async uniqueSlug(title: string): Promise<string> {
    const base = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'item';
    let slug = base;
    while (await this.items.existsBy({ slug })) slug = `${base}-${randomBytes(3).toString('hex')}`;
    return slug;
  }
}
