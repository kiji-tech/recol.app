import React from 'react';
import { View, Text } from 'react-native';
import { Place } from '../../types/Place';
type Props = {
  selectedPlace: Place;
};
export default function DirectionBottomSheetBody({ selectedPlace }: Props) {
  return (
    <View className="w-full flex-1">
      <Text>{selectedPlace.displayName.text}</Text>
    </View>
  );
}
