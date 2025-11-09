import React, { useImperativeHandle, useRef } from 'react';
import { ForwardedRef, forwardRef } from 'react';
import PlaceCard from '../Place/PlaceCard';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { Schedule } from '@/src/features/schedule';
import { Place } from '@/src/features/map/types/Place';
import { ScrollResponderMixin } from 'react-native';

type Props = {
  selectedPlace: Place | null;
  selectedSchedule: Schedule | null;
  onSelectedPlace: (place: Place) => void;
};

const SelectedMapBottomSheetBody = forwardRef(
  (
    { selectedSchedule, selectedPlace, onSelectedPlace }: Props,
    ref: ForwardedRef<BottomSheetScrollViewMethods>
  ) => {
    // === Member ===
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
        getScrollResponder: () =>
          scrollRef.current?.getScrollResponder() || ({} as ScrollResponderMixin),
        getScrollableNode: () => scrollRef.current?.getScrollableNode() || 0,
        getInnerViewNode: () => scrollRef.current?.getInnerViewNode() || 0,
        setNativeProps: (props: object) => scrollRef.current?.setNativeProps(props),
      }));
    }

    return (
      <BottomSheetScrollView ref={scrollRef} className="w-full flex-1">
        {selectedSchedule?.place_list?.map((place: Place) => (
          <PlaceCard
            key={place.id}
            place={place}
            selected={selectedPlace?.id === place.id}
            onSelect={() => onSelectedPlace(place)}
          />
        ))}
      </BottomSheetScrollView>
    );
  }
);

SelectedMapBottomSheetBody.displayName = 'SelectedMapBottomSheetBody';

export default SelectedMapBottomSheetBody;
