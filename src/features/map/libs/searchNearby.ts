import { Place } from '@/src/features/map/types/Place';
import { Session } from '@supabase/supabase-js';
import { fetchCachePlace } from '../apis/fetchCachePlace';
import { MapCategory } from '../types/MapCategory';

const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';
// スポットは50個以下にする必要がある
const INCLUDED_TYPES: Record<MapCategory, string[]> = {
  cafe: ['cafe', 'coffee_shop', 'cafeteria', 'tea_house', 'cat_cafe', 'bakery'],
  meal: [
    'bar',
    'bar_and_grill',
    'chinese_restaurant',
    'chocolate_factory',
    'chocolate_shop',
    'confectionery',
    'deli',
    'dessert_restaurant',
    'dessert_shop',
    'diner',
    'fast_food_restaurant',
    'fine_dining_restaurant',
    'food_court',
    'french_restaurant',
    'greek_restaurant',
    'hamburger_restaurant',
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
  ],
  hotel: [
    'bed_and_breakfast',
    'budget_japanese_inn',
    'campground',
    'camping_cabin',
    'cottage',
    'extended_stay_hotel',
    'farmstay',
    'hotel',
    'inn',
    'japanese_inn',
    'lodging',
    'mobile_home_park',
    'motel',
    'private_guest_room',
    'resort_hotel',
    'rv_park',
  ],
  spot: [
    'adventure_sports_center',
    'amphitheatre',
    'amusement_center',
    'amusement_park',
    'aquarium',
    'banquet_hall',
    'barbecue_area',
    'botanical_garden',
    'bowling_alley',
    'casino',
    'childrens_camp',
    'comedy_club',
    'community_center',
    'concert_hall',
    'convention_center',
    'cultural_center',
    'cycling_park',
    'dance_hall',
    'dog_park',
    'event_venue',
    'ferris_wheel',
    'garden',
    'internet_cafe',
    'karaoke',
    'marina',
    'movie_rental',
    'movie_theater',
    'national_park',
    'night_club',
    'observation_deck',
    'off_roading_area',
    'opera_house',
    'park',
    'philharmonic_hall',
    'picnic_ground',
    'planetarium',
    'plaza',
    'roller_coaster',
    'skateboard_park',
    'state_park',
    'tourist_attraction',
    'video_arcade',
    'visitor_center',
    'water_park',
    'wedding_venue',
    'wildlife_park',
    'wildlife_refuge',
    'zoo',
    'art_studio',
    'auditorium',
  ],
  selected: [],
  text: [],
};
const FiledMaskValue = 'places.id';

export const searchNearby = async (
  session: Session | null,
  latitude: number,
  longitude: number,
  category: MapCategory,
  radius: number = 2000
): Promise<Place[]> => {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchNearby`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
    body: JSON.stringify({
      maxResultCount: process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAX_RESULT_COUNT || 3,
      languageCode: 'ja',
      includedTypes: INCLUDED_TYPES[category],
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude,
          },
          radius: radius,
        },
      },
    }),
  }).then(async (response) => {
    const { places } = await response.json();
    // cacheから取得する
    const cachePlaces = await fetchCachePlace(
      places.map((place: { id: string }) => place.id),
      session
    );
    return cachePlaces;
  });
  return response as unknown as Place[];
};
