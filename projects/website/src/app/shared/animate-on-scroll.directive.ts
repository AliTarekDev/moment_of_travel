import { Directive, ElementRef, Injectable, NgZone, OnDestroy, afterNextRender, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
class ScrollAnimationObserver {
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  observe(element: HTMLElement): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.observer ??= new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('scroll-reveal-pending');
            entry.target.classList.add('animate__animated', 'animate__fadeIn');
          } else {
            entry.target.classList.remove('animate__animated', 'animate__fadeIn');
            entry.target.classList.add('scroll-reveal-pending');
          }
        }
      }, { rootMargin: '0px 0px -32px 0px' });

      element.classList.add('scroll-reveal-pending');
      this.observer.observe(element);
    });
  }

  unobserve(element: HTMLElement): void {
    this.observer?.unobserve(element);
  }
}

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true,
})
export class AnimateOnScrollDirective implements OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly observer = inject(ScrollAnimationObserver);

  constructor() {
    afterNextRender(() => this.observer.observe(this.element));
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.element);
  }
}
