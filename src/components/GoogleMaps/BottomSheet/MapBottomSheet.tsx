import React, { useEffect, useState } from 'react';
import BottomSheetLayout from '../../BottomSheetLayout';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import { Place } from '@/src/entities/Place';
import { MapCategory } from '@/src/entities/MapCategory';
import PlaceDetail from './PlaceDetail';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';

type Props = {
  placeList: Place[];
  selectedPlace: Place | null;
  selectedPlaceList: Place[];
  isSelected: boolean;
  selectedCategory: MapCategory;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  onSelectedPlace: (place: Place) => void;
  onSelectedCategory: (id: MapCategory) => void;
  bottomSheetRef?: React.RefObject<BottomSheet>;
  scrollRef?: React.RefObject<BottomSheetScrollViewMethods>;
};
export default function MapBottomSheet({
  placeList,
  selectedPlace,
  selectedPlaceList,
  selectedCategory,
  isSelected = false,
  onAdd,
  onRemove,
  onSelectedPlace,
  onSelectedCategory,
  bottomSheetRef,
  scrollRef,
}: Props) {
  // ==== Member ====
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [isDetailPlace, setIsDetailPlace] = useState(false);

  // ==== Method ====
  const handleSelect = (place: Place) => {
    onSelectedPlace(place);
    setDetailPlace(place);
    setIsDetailPlace(true);
  };

  useEffect(() => {
    setDetailPlace(selectedPlace);
  }, [selectedPlace]);

  // ==== Render ====
  return (
    <BottomSheetLayout ref={bottomSheetRef}>
      {isDetailPlace && detailPlace ? (
        <PlaceDetail
          place={detailPlace}
          selected={selectedPlaceList.findIndex((place) => place.id === detailPlace.id) >= 0}
          onAdd={onAdd}
          onRemove={onRemove}
          onClose={() => setIsDetailPlace(false)}
        />
      ) : (
        <>
          <MapBottomSheetHeader
            selectedCategory={selectedCategory}
            onSelectedCategory={onSelectedCategory}
          />
          <MapBottomSheetBody
            placeList={isSelected ? selectedPlaceList : placeList}
            selectedPlace={selectedPlace}
            onSelect={handleSelect}
            ref={scrollRef}
          />
        </>
      )}
    </BottomSheetLayout>
  );
}
