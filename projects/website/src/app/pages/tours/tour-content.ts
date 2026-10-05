import { PublicCatalogItem } from '../../services/catalog-api.service';

export interface TourDay { title: string; text: string; }
export interface TourContent { introduction: string; days: TourDay[]; }

// The dashboard writes explicit day headings; plain descriptions stay plain text.
export function parseTourContent(description: string | null): TourContent {
  const source = (description ?? '').replace(/\r\n/g, '\n');
  const heading = /^##\s+(?:Day|اليوم)\s+[0-9٠-٩]+\s*:\s*(.+)$/gm;
  const matches = [...source.matchAll(heading)];
  if (!matches.length) return { introduction: source.trim(), days: [] };
  return {
    introduction: source.slice(0, matches[0].index).trim(),
    days: matches.map((match, index) => ({
      title: match[1].trim(),
      text: source.slice(match.index! + match[0].length, matches[index + 1]?.index ?? source.length).trim(),
    })),
  };
}

export function localizedTourField(item: PublicCatalogItem, field: 'title' | 'summary' | 'description' | 'location', language: 'ar' | 'en'): string {
  return String(item[`${field}${language === 'ar' ? 'Ar' : 'En'}`] || item[`${field}${language === 'ar' ? 'En' : 'Ar'}`] || '');
}

export function tourDayCount(item: PublicCatalogItem): number | null {
  if (item.durationDays) return item.durationDays;
  if (item.itinerary?.length) return item.itinerary.length;
  const days = parseTourContent(item.descriptionEn || item.descriptionAr).days.length;
  if (days) return days;
  if (item.startDate && item.endDate) {
    const difference = Date.parse(item.endDate) - Date.parse(item.startDate);
    if (Number.isFinite(difference) && difference >= 0) return Math.floor(difference / 86400000) + 1;
  }
  return null;
}

export function tourContent(item: PublicCatalogItem, language: 'ar' | 'en'): TourContent {
  const legacy = parseTourContent(localizedTourField(item, 'description', language));
  if (!item.itinerary?.length) return legacy;
  const suffix = language === 'ar' ? 'Ar' : 'En';
  const fallback = language === 'ar' ? 'En' : 'Ar';
  return { introduction: legacy.introduction, days: item.itinerary.map(day => ({
    title: day[`title${suffix}`] || day[`title${fallback}`],
    text: day[`text${suffix}`] || day[`text${fallback}`],
  })) };
}
