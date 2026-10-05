import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export interface CatalogImageFile { buffer: Buffer; mimetype: string; size: number; }

@Injectable()
export class CatalogImagesService {
  private readonly directory: string;
  constructor(config: ConfigService) {
    this.directory = resolve(config.get<string>('CATALOG_UPLOAD_DIR') || 'apps/api/uploads/catalog');
  }
  async upload(file?: CatalogImageFile) {
    if (!file?.buffer?.length || file.buffer.length > 5 * 1024 * 1024) throw new BadRequestException('Image must be between 1 byte and 5 MB');
    const data = file.buffer;
    const formats: Record<string, { extension: string; matches: boolean }> = {
      'image/jpeg': { extension: 'jpg', matches: data.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) },
      'image/png': { extension: 'png', matches: data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
      'image/webp': { extension: 'webp', matches: data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP' },
    };
    const format = formats[file.mimetype];
    if (!format?.matches) throw new BadRequestException('Only JPG, PNG and WebP image files are allowed');
    const name = `${randomUUID()}.${format.extension}`;
    await mkdir(this.directory, { recursive: true });
    await writeFile(join(this.directory, name), data, { flag: 'wx' });
    return { imageUrl: `/api/catalog/images/${name}` };
  }
  async read(name: string) {
    if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name)) throw new NotFoundException('Image not found');
    try {
      const data = await readFile(join(this.directory, name));
      return { data, mime: name.endsWith('.jpg') ? 'image/jpeg' : name.endsWith('.png') ? 'image/png' : 'image/webp' };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new NotFoundException('Image not found');
      throw error;
    }
  }
}
