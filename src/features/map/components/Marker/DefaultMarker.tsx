import React from 'react';
import { Marker } from 'react-native-maps';
import { Place } from '../../types/Place';

/** デフォルトのマーカー */
type Props = {
  place: Place;
  onPress?: () => void;
};

export default function DefaultMarker({ place, onPress = () => void 0 }: Props) {
  return <Marker coordinate={place.location} title={place.displayName.text} onPress={onPress} />;
}
