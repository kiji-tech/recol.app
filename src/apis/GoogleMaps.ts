const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';

const coffeeShopsCategory = [
  'american_restaurant',
  'bakery',
  'bar',
  'barbecue_restaurant',
  'brazilian_restaurant',
  'breakfast_restaurant',
  'brunch_restaurant',
  'cafe',
  'chinese_restaurant',
  'coffee_shop',
  'fast_food_restaurant',
  'french_restaurant',
  'greek_restaurant',
  'hamburger_restaurant',
  'ice_cream_shop',
  'indian_restaurant',
  'indonesian_restaurant',
  'italian_restaurant',
  'japanese_restaurant',
  'korean_restaurant',
  'lebanese_restaurant',
  'meal_delivery',
  'meal_takeaway',
  'mediterranean_restaurant',
  'mexican_restaurant',
  'middle_eastern_restaurant',
  'pizza_restaurant',
  'ramen_restaurant',
  'restaurant',
  'sandwich_shop',
  'seafood_restaurant',
  'spanish_restaurant',
  'steak_house',
  'sushi_restaurant',
  'thai_restaurant',
  'turkish_restaurant',
  'vegan_restaurant',
  'vegetarian_restaurant',
  'vietnamese_restaurant',
];

const hotels = [
  'bed_and_breakfast',
  'campground',
  'camping_cabin',
  'cottage',
  'extended_stay_hotel',
  'farmstay',
  'guest_house',
  'hostel',
  'hotel',
  'lodging',
  'motel',
  'private_guest_room',
  'resort_hotel',
  'rv_park',
];

async function searchNearby(latitude: number, longitude: number, coffee: boolean, hotel: boolean) {
  console.log({ latitude, longitude });

  let includedTypes: string[] = [];
  if (coffee) {
    includedTypes = includedTypes.concat(coffeeShopsCategory);
  }
  if (hotel) {
    includedTypes = includedTypes.concat(hotels);
  }

  console.log(includedTypes);

  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': '*',
    }),
    body: JSON.stringify({
      maxResultCount: 20,
      languageCode: 'ja',
      includedTypes,
      locationRestriction: {
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
    .catch((e) => console.log(e));
  console.log(response);
  return response.places;
}

async function searchText(latitude: number, longitude: number, text: string) {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchText`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': '*',
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
