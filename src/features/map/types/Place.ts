import { LatLng } from 'react-native-maps';

export interface Review {
  name: string;
  text: { text: string; languageCode: string };
  relativePublishTimeDescription: string;
  rating: number;
  orighinalText: { text: string; languageCode: string };
  authorAttribution: {
    displayName: string;
    url: string;
    photoUrl: string;
  };
  publishTime: string;
}

export interface Photos {
  id: string;
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributes: { displayName: string; url: string; photoUri: string }[];
}

export interface Place {
  id: string;
  types: string[];
  rating: number;
  formattedAddress: string;
  internationalPhonNumber: string;
  nationanlPhoneNumber: string;
  reviews: Review[];
  photos: Photos[];
  goodForChildren: boolean;
  paymentOptions: { acceptsCreditCards: boolean; acceptsCacheOnly: boolean };
  accessibilityOptions: {
    wheelchairAccessibleParking: boolean;
    wheelchairAccessibleEntrance: boolean;
  };
  location: LatLng;
  viewport: {
    low: LatLng;
    high: LatLng;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
  primaryTypeDisplayName: { text: string; languageCode: string };
  primaryType: string;
  googleMapsUri: string;
  googleMapsLinks: { placeUri: string }[];
  editorialSummary: { text: string };
  websiteUri: string;
  currentOpeningHours: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
}
