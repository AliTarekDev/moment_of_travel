import { BadRequestException } from '@nestjs/common';
import { ServiceType } from './booking.entity';
import { CreateBookingDto } from './bookings.dto';
import { TailorMadeDto } from './tailor-made.dto';

const labels: Record<string, string> = {
  firstName: 'First name',
  email: 'Email',
  adults: 'Adults (18+)',
  children: 'Children (0–17)',
  origin: 'Travelling from',
  arrivalDate: 'Arrival in Egypt',
  departureDate: 'Departure from Egypt',
  flightsBooked: 'International flights already booked',
  days: 'Preferred days in Egypt',
  occasions: 'Special occasions',
  cairoSites: 'Cairo and Giza sites',
  luxor: 'Visit Luxor',
  aswan: 'Visit Aswan',
  abuSimbel: 'Visit Abu Simbel',
  cruise: 'Nile cruise',
  alexandria: 'Visit Alexandria',
  otherPlaces: 'Other places',
  experiences: 'Additional experiences',
  otherExperiences: 'Other experiences',
  vip: 'Discuss Ultra-VIP access',
  hotels: 'Include five-star hotels',
  notes: 'Additional notes',
};
const options: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  giza: 'Giza pyramids and Sphinx',
  saqqara: 'Saqqara and Dahshur',
  museums: 'GEM / Egyptian Museum / NMEC',
  oldCairo: 'Old Cairo and Khan el-Khalili',
  citadel: 'Citadel and Alabaster Mosque',
  coptic: 'Coptic quarter',
  other: 'Other',
  none: 'None',
  three: '3 nights: Aswan to Luxor',
  four: '4 nights: Luxor to Aswan',
  seven: '7 nights: Luxor–Aswan–Luxor',
  camel: 'Camel ride at the pyramids',
  dance: 'Belly dancing show',
  felucca: 'Felucca sail',
  balloon: 'Sunrise hot-air balloon in Luxor',
};
export function tailorMadeBooking(dto: TailorMadeDto): CreateBookingDto {
  const validDate = (value: string) => {
    const date = new Date(value + 'T00:00:00Z');
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  };
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  if (
    !validDate(dto.arrivalDate) ||
    !validDate(dto.departureDate) ||
    dto.arrivalDate < today ||
    dto.departureDate < dto.arrivalDate
  )
    throw new BadRequestException(
      'Choose valid future travel dates, with departure on or after arrival.',
    );
  if (dto.adults + dto.children > 50)
    throw new BadRequestException(
      'The group must contain at most 50 travellers.',
    );
  if (!dto.firstName.trim() || dto.origin.trim().length < 2 || !dto.days.trim())
    throw new BadRequestException('Required answers cannot be blank.');
  if (dto.experiences.includes('none') && dto.experiences.length > 1)
    throw new BadRequestException(
      'None cannot be combined with other experiences.',
    );
  const lines = Object.entries(labels).map(([key, label]) => {
    const value = dto[key as keyof TailorMadeDto];
    const display = Array.isArray(value)
      ? value.map((item) => options[item] ?? item).join(', ')
      : typeof value === 'string'
        ? [
            'flightsBooked',
            'luxor',
            'aswan',
            'abuSimbel',
            'cruise',
            'alexandria',
            'vip',
            'hotels',
          ].includes(key)
          ? options[value]
          : value.trim()
        : value;
    return (
      label +
      ': ' +
      (display === '' || display === undefined || display === null
        ? 'Not specified'
        : display)
    );
  });
  return {
    customerName: dto.firstName.trim(),
    customerEmail: dto.email.trim().toLowerCase(),
    // This email-only questionnaire intentionally does not collect a phone number.
    customerPhone: '',
    serviceType: ServiceType.TOUR,
    destination: 'Egypt — Tailor-made itinerary',
    departureCity: dto.origin.trim(),
    departureDate: dto.arrivalDate,
    returnDate: dto.departureDate,
    travelers: dto.adults + dto.children,
    includesHotels: dto.hotels === 'yes',
    customerNotes: 'TAILOR-MADE ITINERARY REQUEST\n\n' + lines.join('\n\n'),
  };
}
