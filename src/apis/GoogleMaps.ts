const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';

export const ParkType = ['park', 'amusement_park', 'campground', 'rv_park'];
export const CafeType = ['cafe', 'coffee_shop', 'restaurant'];
export const HotelsType = [
  'bed_and_breakfast',
  'extended_stay_hotel',
  'guest_house',
  'hostel',
  'hotel',
  'lodging',
  'motel',
  'resort_hotel',
];

const FiledMaskValue =
  'places.id,places.types,places.reviews,places.displayName,places.formattedAddress,places.rating,places.location,places.photos,places.websiteUri,places.editorialSummary';

async function searchId(placeId: string) {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}/${placeId}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask':
        'id,types,reviews,displayName,formattedAddress,rating,location,photos,websiteUri',
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.log(e));
  return response;
}

async function searchNearby(latitude: number, longitude: number, radius: number) {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
    body: JSON.stringify({
      maxResultCount: 20,
      languageCode: 'ja',
      includedTypes: [...ParkType, ...CafeType, ...HotelsType],
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius,
        },
      },
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.log(e));
  return response.places;
}

async function searchPlaceByText(latitude: number, longitude: number, text: string) {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchText`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
    body: JSON.stringify({
      textQuery: text,
      maxResultCount: 20,
      languageCode: 'ja',
      locationBias: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 2000,
        },
      },
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.log(JSON.stringify(e)));
  return response.places;
}
export { searchId, searchNearby, searchPlaceByText };
