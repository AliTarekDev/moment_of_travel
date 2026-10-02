import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { LanguageService } from '../../i18n/language.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-travel-nav',
  standalone: true,
  imports: [CommonModule, LanguageSwitchComponent, TranslatePipe, FontAwesomeModule],
  templateUrl: './travel-nav.component.html',
  styleUrl: './travel-nav.component.scss',
})
export class TravelNavComponent {
  private readonly document = inject(DOCUMENT);
  readonly languages = inject(LanguageService);
  mobileMenuOpen = false;
  isScrolled = false;
  readonly icons = { bars: faBars };

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = (this.document.defaultView?.scrollY ?? 0) > 0;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.document.body.classList.remove('side-nav-open');
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) > 1000) this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.document.body.classList.toggle('side-nav-open', this.mobileMenuOpen);
  }
}
