import React, { useState } from 'react';
import BottomSheetLayout from '../../BottomSheetLayout';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import { Place } from '@/src/entities/Place';
import { MapCategory } from '@/src/entities/MapCategory';
import PlaceDetail from './PlaceDetail';

type Props = {
  placeList: Place[];
  selectedPlaceList: Place[];
  isSelected: boolean;
  selectedCategory: MapCategory;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  onSelectedPlace: (place: Place) => void;
  onSelectedCategory: (id: MapCategory) => void;
};
export default function MapBottomSheet({
  placeList,
  selectedPlaceList,
  selectedCategory,
  isSelected = false,
  onAdd,
  onRemove,
  onSelectedPlace,
  onSelectedCategory,
}: Props) {
  // ==== Member ====
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // ==== Method ====
  const handleSelect = (place: Place) => {
    onSelectedPlace(place);
    setSelectedPlace(place);
  };

  // ==== Render ====
  return (
    <BottomSheetLayout>
      {selectedPlace ? (
        <PlaceDetail
          place={selectedPlace}
          selected={selectedPlaceList.findIndex((place) => place.id === selectedPlace.id) >= 0}
          onAdd={onAdd}
          onRemove={onRemove}
          onClose={() => setSelectedPlace(null)}
        />
      ) : (
        <>
          <MapBottomSheetHeader
            selectedCategory={selectedCategory}
            onSelectedCategory={onSelectedCategory}
          />
          <MapBottomSheetBody
            placeList={isSelected ? selectedPlaceList : placeList}
            selectedPlaceList={selectedPlaceList}
            onSelect={handleSelect}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </>
      )}
    </BottomSheetLayout>
  );
}
