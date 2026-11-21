import { DOCUMENT, ViewportScroller } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, ElementRef, HostListener, Injector, OnDestroy, ViewChild, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faBars, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { LanguageService } from '../../i18n/language.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-travel-nav',
  standalone: true,
  imports: [CdkTrapFocus, TranslatePipe, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './travel-nav.component.html',
  styleUrls: ['./travel-nav.component.scss', './travel-nav-responsive.scss'],
})
export class TravelNavComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly languages = inject(LanguageService);
  mobileMenuOpen = false;
  isScrolled = false;
  readonly icons = { bars: faBars, chevronDown: faChevronDown, close: faXmark, arrowRight: faArrowRight };
  @ViewChild('featuresDropdown') private featuresDropdown?: ElementRef<HTMLDetailsElement>;
  @ViewChild('mobileMenuButton') private mobileMenuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileCloseButton') private mobileCloseButton?: ElementRef<HTMLButtonElement>;

  constructor() {
    inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(() => this.closeMobileMenu());
    this.viewportScroller.setOffset(() => {
      const logoHeight = this.element.nativeElement.querySelector('.brand--logo')?.getBoundingClientRect().height ?? 0;
      return [0, Math.max(112, logoHeight + 16)];
    });
  }

  ngOnDestroy(): void {
    this.closeMobileMenu();
    this.viewportScroller.setOffset([0, 0]);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = (this.document.defaultView?.scrollY ?? 0) > 0;
  }

  closeMobileMenu(): void {
    this.closeFeatures();
    this.mobileMenuOpen = false;
    this.document.body.classList.remove('side-nav-open');
  }

  dismissMobileMenu(): void {
    this.closeMobileMenu();
    this.mobileMenuButton?.nativeElement.focus();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.mobileMenuOpen) {
      this.dismissMobileMenu();
      return;
    }
    const dropdown = this.featuresDropdown?.nativeElement;
    if (dropdown?.open) dropdown.querySelector('summary')?.focus();
    this.closeFeatures();
  }

  closeFeatures(): void {
    const dropdown = this.featuresDropdown?.nativeElement;
    if (dropdown) dropdown.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.featuresDropdown?.nativeElement.contains(event.target as Node | null)) this.closeFeatures();
  }

  onFeaturesFocusOut(event: FocusEvent): void {
    if (!this.featuresDropdown?.nativeElement.contains(event.relatedTarget as Node | null)) this.closeFeatures();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.document.defaultView?.matchMedia('(min-width: 1101px)').matches) this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.dismissMobileMenu();
      return;
    }
    this.closeFeatures();
    this.mobileMenuOpen = true;
    this.document.body.classList.add('side-nav-open');
    afterNextRender(() => {
      if (this.mobileMenuOpen) this.mobileCloseButton?.nativeElement.focus();
    }, { injector: this.injector });
  }
}
