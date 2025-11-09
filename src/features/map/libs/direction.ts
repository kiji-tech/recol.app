// https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY

const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export const fetchDirection = async (
  origin: string,
  destination: string,
  mode: 'walking' | 'driving' | 'transit' = 'walking'
) => {
  const urlParams = new URLSearchParams();
  urlParams.append('origin', origin);
  urlParams.append('destination', destination);
  urlParams.append('mode', mode);
  urlParams.append('key', process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '');
  const response = await fetch(`${API_URL}?${urlParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch direction');
  }
  const data = await response.json();
  return data;
};
