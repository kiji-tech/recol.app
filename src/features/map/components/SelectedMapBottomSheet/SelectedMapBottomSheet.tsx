import React from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import PlaceCard from '../Place/PlaceCard';
import { Place } from '@/src/features/map/types/Place';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type Props = {
  placeList: Place[];
  selectedPlace: Place | null;
  onSelectedPlace: (place: Place) => void;
};

export default function SelectedMapBottomSheet({
  placeList,
  selectedPlace,
  onSelectedPlace,
}: Props) {
  return (
    <BottomSheetLayout>
      <BottomSheetScrollView>
        {placeList.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            selected={selectedPlace?.id === place.id}
            onSelect={() => onSelectedPlace(place)}
          />
        ))}
      </BottomSheetScrollView>
    </BottomSheetLayout>
  );
}
