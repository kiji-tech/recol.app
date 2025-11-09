import { Direction, DirectionMode } from '../types/Direction';

// https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

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
  const response = await fetch(`${API_URL}?${urlParams.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data as unknown as Direction;
};
