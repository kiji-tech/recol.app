import React, { useImperativeHandle, useRef } from 'react';
import { ForwardedRef, forwardRef } from 'react';
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { Schedule } from '@/src/features/schedule';
import { Place, PlaceCard, useMap } from '@/src/features/map';
import { ScrollResponderMixin, Text, View } from 'react-native';
import { Loading } from '@/src/components';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  selectedPlace: Place | null;
  selectedSchedule: Schedule | null;
  selectedPlaceList: Place[];
  onSelectedPlace: (place: Place) => void;
};

const ScheduleBottomSheetBody = forwardRef(
  (
    { selectedSchedule, selectedPlace, onSelectedPlace, selectedPlaceList }: Props,
    ref: ForwardedRef<BottomSheetScrollViewMethods>
  ) => {
    // === Member ===
    const { isSearchLoading } = useMap();
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

    // === Render ===
    if (isSearchLoading) return <Loading />;
    return (
      <BottomSheetScrollView ref={scrollRef} className="w-full flex-1">
        {!selectedSchedule && (
          <View className="w-full p-8">
            <Text className="text-center text-light-text dark:text-dark-text">
              {generateI18nMessage('FEATURE.MAP.NO_SELECTED')}
            </Text>
          </View>
        )}
        {selectedPlaceList.map((place: Place) => (
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

ScheduleBottomSheetBody.displayName = 'ScheduleBottomSheetBody';

export default ScheduleBottomSheetBody;
