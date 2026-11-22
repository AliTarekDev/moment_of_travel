import { AnimateOnScrollDirective } from '../../shared/animate-on-scroll.directive';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { LanguageService } from '../../i18n/language.service';
import { AccessibleCarouselDirective } from '../../shared/accessible-carousel.directive';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { FaqSectionComponent } from '../contact/faq-section.component';
import { LuxuryGallerySectionComponent } from './sections/luxury-gallery-section.component';
import { PlanTourCtaSectionComponent } from './sections/plan-tour-cta-section.component';
import { SignatureToursSectionComponent } from './sections/signature-tours-section.component';
import { TourCategoriesSectionComponent } from './sections/tour-categories-section.component';
import { TravelNavComponent } from './travel-nav.component';
import { WhyChooseUsSectionComponent } from './sections/why-choose-us-section.component';

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [AnimateOnScrollDirective, AccessibleCarouselDirective, CarouselModule, RouterLink, TranslatePipe, LuxuryGallerySectionComponent, WhyChooseUsSectionComponent, SignatureToursSectionComponent, PlanTourCtaSectionComponent, TravelNavComponent, TourCategoriesSectionComponent, FaqSectionComponent],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  private readonly document = inject(DOCUMENT);
  readonly languages = inject(LanguageService);
  readonly activeSlide = signal(0);
  readonly heroImages = [
    { id: 'travel-video', video: '/vedio/ved2.mp4', image: '/cover.jpg', alt: 'travel.videoLabel' },
    { id: 'temple', image: '/cover.jpg', alt: 'gallery.templeArchitecture' },
    { id: 'nile', image: '/8.jpg', alt: 'whyAncientPaths.imageAlt' },
  ];
  readonly heroOptions = computed<OwlOptions>(() => ({
    items: 1, rtl: this.languages.language() === 'ar', loop: false, rewind: true,
    autoplay: true, autoplayTimeout: 5000,
    dots: false, nav: false, mouseDrag: true, touchDrag: true,
    pullDrag: false, smartSpeed: 500,
    // Owl only installs its window resize watcher when responsive has a breakpoint.
    responsive: { 0: { items: 1 } },
  }));

  slideChanged(event: SlidesOutputData): void { this.activeSlide.set(event.startPosition ?? 0); }

  openVideoFullscreen(video: HTMLVideoElement & { webkitEnterFullscreen?: () => void }): void {
    if (video.requestFullscreen && this.document.fullscreenEnabled) {
      void video.requestFullscreen().catch(() => {});
      return;
    }
    video.webkitEnterFullscreen?.();
  }

  // Keep in-page links on the current language route despite the root base URL.
  @HostListener('click', ['$event'])
  onSectionLink(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const section = this.document.getElementById(anchor?.getAttribute('href')?.slice(1) ?? '');
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}
