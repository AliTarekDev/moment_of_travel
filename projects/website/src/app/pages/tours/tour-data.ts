export interface SignatureTour { slug: string; titleKey: string; durationKey: string; summaryKey: string; image: string; }

export const TOURS: SignatureTour[] = [
  {
    "slug": "cairo-pyramids",
    "titleKey": "tourUi.cairoPyramidsGrandEgyptianMuseum",
    "durationKey": "tourUi.5Days",
    "summaryKey": "tourUi.aRefinedIntroductionToAncientEgyptWithPrivatePyramid",
    "image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1000&q=84"
  },
  {
    "slug": "nile-cruise",
    "titleKey": "tourUi.nileCruiseFromLuxorToAswan",
    "durationKey": "tourUi.8Days",
    "summaryKey": "tourUi.sailBetweenTemplesTombsAndGoldenRiverViewsAboard",
    "image": "https://images.unsplash.com/photo-1623674567450-b600b67864a6?auto=format&fit=crop&w=1000&q=84"
  },
  {
    "slug": "family-adventure",
    "titleKey": "tourUi.egyptFamilyLuxuryAdventure",
    "durationKey": "tourUi.9Days",
    "summaryKey": "tourUi.aFamilyfriendlyItineraryBalancingExpertStorytellingComfortablePacingPrivate",
    "image": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1000&q=84"
  },
  {
    "slug": "red-sea-desert",
    "titleKey": "tourUi.redSeaDesertAncientWonders",
    "durationKey": "tourUi.10Days",
    "summaryKey": "tourUi.combineHistoricCairoDesertStillnessAndAFivestarRed",
    "image": "https://images.unsplash.com/photo-1593385069384-2e2006c5508e?auto=format&fit=crop&w=1000&q=84"
  }
];
