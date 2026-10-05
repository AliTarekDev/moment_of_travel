import { DOCUMENT } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { AR } from './ar';
import { EN } from './en';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly document = inject(DOCUMENT);
  transform(key: string): string {
    let value: unknown = this.document.documentElement.lang.startsWith('en') ? EN : AR;
    for (const part of key.split('.')) value = (value as Record<string, unknown>)?.[part];
    return typeof value === 'string' ? value : key;
  }
}
