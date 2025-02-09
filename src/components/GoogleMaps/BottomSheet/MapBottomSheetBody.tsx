import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Place } from '@/src/entities/Place';
import PlaceCard from './PlaceCard';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';

type Props = {
  placeList: Place[];
  selectedPlace: Place | null;
  selectedPlaceList: Place[];
  onSelect: (place: Place) => void;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
};
const MapBottomSheetBody = forwardRef(
  ({ placeList, selectedPlace, selectedPlaceList, onSelect, onAdd, onRemove }: Props, ref: any) => {
    // ==== Member ====
    const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
    if (ref) {
      useImperativeHandle(ref, () => ({
        scrollTo: (
          y: number | { x?: number; y?: number; animated?: boolean },
          x?: number,
          animated?: boolean
        ) => {
          scrollRef.current?.scrollTo(y, x, animated);
        },
        scrollToEnd: (options?: { animated: boolean }) => {
          scrollRef.current?.scrollToEnd(options);
        },
      }));
    }

    // ==== Method ====
    // ==== Render ====
    return (
      <>
        <BottomSheetScrollView className="w-full flex-1" ref={scrollRef}>
          {placeList &&
            placeList.map((place: Place) => (
              <PlaceCard
                key={place.id}
                place={place}
                selected={selectedPlace ? selectedPlace.id === place.id : false}
                // onDetailView={() => { }}
                onSelect={onSelect}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
        </BottomSheetScrollView>
      </>
    );
  }
);

export default MapBottomSheetBody;
