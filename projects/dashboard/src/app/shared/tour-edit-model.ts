import { CatalogItem } from '../core/api.models';
import { EditableTourDay, emptyTourDay } from './tour-itinerary-editor.component';

function legacyDescription(source: string | null) {
  const text = (source ?? '').replace(/\r\n/g, '\n');
  const matches = [...text.matchAll(/^##\s+(?:Day|اليوم)\s+[0-9٠-٩]+\s*:\s*(.+)$/gm)];
  return { introduction: matches.length ? text.slice(0, matches[0].index).trim() : text, days: matches.map((match, index) => ({ title: match[1].trim(), text: text.slice(match.index! + match[0].length, matches[index + 1]?.index ?? text.length).trim() })) };
}
export function editableTourContent(item: CatalogItem) {
  const ar = legacyDescription(item.descriptionAr);
  const en = legacyDescription(item.descriptionEn);
  const days: EditableTourDay[] = item.itinerary?.length ? item.itinerary.map(day => ({ ...day })) : Array.from({ length: Math.max(ar.days.length, en.days.length) }, (_value, index) => ({
    titleAr: ar.days[index]?.title ?? '', textAr: ar.days[index]?.text ?? '',
    titleEn: en.days[index]?.title ?? '', textEn: en.days[index]?.text ?? '',
  }));
  const duration = item.durationDays || days.length || 1;
  while (days.length < duration) days.push(emptyTourDay());
  return { days, duration, descriptionAr: ar.introduction, descriptionEn: en.introduction };
}
