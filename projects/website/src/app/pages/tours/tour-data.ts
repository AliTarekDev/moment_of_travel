export interface SignatureTour { slug: string; titleKey: string; durationKey: string; summaryKey: string; image: string; }

export const TOURS: SignatureTour[] = [
  {
    "slug": "cairo-pyramids",
    "titleKey": "tourUi.cairoPyramidsGrandEgyptianMuseum",
    "durationKey": "tourUi.5Days",
    "summaryKey": "tourUi.aRefinedIntroductionToAncientEgyptWithPrivatePyramid",
    "image": "/pyramid.JPG"
  },
  {
    "slug": "nile-cruise",
    "titleKey": "tourUi.nileCruiseFromLuxorToAswan",
    "durationKey": "tourUi.8Days",
    "summaryKey": "tourUi.sailBetweenTemplesTombsAndGoldenRiverViewsAboard",
    "image": "/8.jpg"
  },
  {
    "slug": "family-adventure",
    "titleKey": "tourUi.egyptFamilyLuxuryAdventure",
    "durationKey": "tourUi.9Days",
    "summaryKey": "tourUi.aFamilyfriendlyItineraryBalancingExpertStorytellingComfortablePacingPrivate",
    "image": "/19.jpg"
  },
  {
    "slug": "red-sea-desert",
    "titleKey": "tourUi.redSeaDesertAncientWonders",
    "durationKey": "tourUi.10Days",
    "summaryKey": "tourUi.combineHistoricCairoDesertStillnessAndAFivestarRed",
    "image": "/16.jpg"
  }
];
