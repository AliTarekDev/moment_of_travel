import { Directive, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/** Prevent keyboard and screen-reader navigation into Owl slides outside the viewport. */
@Directive({ selector: 'owl-carousel-o[appAccessibleCarousel]', standalone: true })
export class AccessibleCarouselDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement;
      const update = () => {
        root.querySelectorAll<HTMLElement>('.owl-item').forEach(slide => {
          const hidden = !slide.classList.contains('active');
          slide.inert = hidden;
          slide.setAttribute('aria-hidden', String(hidden));
        });
      };
      const observer = new MutationObserver(update);
      observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
      update();
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
