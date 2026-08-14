import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LanguageSwitchComponent } from '../../i18n/language-switch.component';
import { TranslatePipe } from '../../i18n/translate.pipe';

type SearchTab = 'Flights' | 'Hotels' | 'Cars' | 'Cruise' | 'Tours';

interface Destination {
  city: string;
  country: string;
  price: number;
  image: string;
}

interface Listing {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  tag: string;
}

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, LanguageSwitchComponent, TranslatePipe],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  activeTab: SearchTab = 'Flights';
  mobileMenuOpen = false;
  readonly searchTabs: SearchTab[] = ['Flights', 'Hotels', 'Cars', 'Cruise', 'Tours'];

  readonly destinations: Destination[] = [
    { city: 'Tokyo', country: 'Japan', price: 899, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=82' },
    { city: 'New York', country: 'United States', price: 1199, image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=900&q=82' },
    { city: 'London', country: 'United Kingdom', price: 749, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=82' },
    { city: 'Sydney', country: 'Australia', price: 1099, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=82' },
    { city: 'Paris', country: 'France', price: 949, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=82' },
    { city: 'Santorini', country: 'Greece', price: 1299, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=82' }
  ];

  readonly listings: Listing[] = [
    { name: 'Hotel Plaza Athenee', location: 'Barcelona, Spain', rating: 5, reviews: 400, price: 500, tag: 'Trending', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=82' },
    { name: 'The Luxe Haven', location: 'London, England', rating: 4.8, reviews: 360, price: 420, tag: 'Popular', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=82' },
    { name: 'The Urban Retreat', location: 'Edinburgh, Scotland', rating: 4.7, reviews: 285, price: 380, tag: 'Best value', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=82' },
    { name: 'Oceanview Resort', location: 'Bali, Indonesia', rating: 4.9, reviews: 510, price: 550, tag: 'Trending', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=82' }
  ];

  setTab(tab: SearchTab): void {
    this.activeTab = tab;
  }
}
