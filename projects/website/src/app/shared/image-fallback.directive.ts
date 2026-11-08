import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/** Keep a missing catalog image from leaving a broken image icon in the layout. */
@Directive({ selector: 'img[appImageFallback]', standalone: true })
export class ImageFallbackDirective {
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @HostListener('error')
  onError(): void {
    const image = this.image.nativeElement;
    if (!image.src.endsWith('/cover.jpg')) image.src = '/cover.jpg';
  }
}
