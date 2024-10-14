const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';

const coffeeShopsCategory = ['cafe', 'coffee_shop', 'restaurant'];

const hotels = [
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
  'places.id,places.types,places.reviews,places.displayName,places.formattedAddress,places.rating,places.location,places.photos,places.websiteUri';

async function searchNearby(
  latitude: number,
  longitude: number,
  radius: number,
  coffee: boolean,
  hotel: boolean
) {
  console.log({ latitude, longitude, radius });

  let includedTypes: string[] = [];
  if (coffee) {
    includedTypes = includedTypes.concat(coffeeShopsCategory);
  }
  if (hotel) {
    includedTypes = includedTypes.concat(hotels);
  }

  console.log({ includedTypes });

  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
    body: JSON.stringify({
      maxResultCount: 10,
      includedTypes,
      languageCode: 'ja',
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

async function searchText(latitude: number, longitude: number, text: string) {
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
export { searchNearby, searchText };
