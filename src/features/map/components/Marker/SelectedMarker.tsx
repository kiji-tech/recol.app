import React from 'react';
import { useTheme } from '@/src/contexts';
import { Marker } from 'react-native-maps';
import { Place } from '../../types/Place';

type Props = {
  place: Place;
  onPress?: () => void;
};
/** 選択中の場所マーカー */
export default function SelectedMarker({ place, onPress = () => void 0 }: Props) {
  const { isDarkMode } = useTheme();
  return (
    <Marker
      title={`✔ ${place.displayName.text}`}
      pinColor={!isDarkMode ? '#B5F3C3' : '#17AC38'}
      coordinate={place.location}
      onPress={onPress}
    ></Marker>
  );
}
