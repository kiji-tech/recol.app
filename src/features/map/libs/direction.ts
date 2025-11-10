import { Direction, DirectionMode } from '../types/Direction';
import * as Localization from 'expo-localization';

// https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Google Maps APIのポリラインエンコーディングをデコード
 * @param encoded {string} エンコードされたポリライン文字列
 * @return {Array<{latitude: number, longitude: number}>} デコードされた座標配列
 */
export const decodePolyline = (encoded: string): Array<{ latitude: number; longitude: number }> => {
  const poly: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat * 1e-5,
      longitude: lng * 1e-5,
    });
  }

  return poly;
};

export const fetchDirection = async (
  origin: string,
  destination: string,
  mode?: DirectionMode
): Promise<Direction> => {
  const urlParams = new URLSearchParams();
  urlParams.append('origin', origin);
  urlParams.append('destination', destination);
  if (mode) {
    urlParams.append('mode', mode);
  }
  urlParams.append('key', process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  urlParams.append('language', Localization.getLocales()[0].languageCode || 'ja');
  const response = await fetch(`${API_URL}?${urlParams.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data as unknown as Direction;
};
