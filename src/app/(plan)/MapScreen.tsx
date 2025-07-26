import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place } from '@/src/entities/Place';
import { ScrollView } from 'react-native-gesture-handler';
import { DEFAULT_RADIUS } from '@/src/libs/ConstValue';
import Map from '@/src/components/GoogleMaps/Map';
import ScheduleInfoCard from './components/(MapScreen)/ScheduleInfoCard';
import PlaceDetailModal from '@/src/components/Modal/PlaceDetailModal';

/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
  const scrollRef = useRef<ScrollView>(null);
  const platform = Platform.OS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { plan } = usePlan();
  const { currentRegion } = useLocation();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    plan &&
      plan.schedule &&
      plan.schedule.length > 0 &&
      plan.schedule[0].place_list &&
      plan.schedule[0].place_list.length > 0
      ? (plan!.schedule[0].place_list[0] as unknown as Place)
      : null
  );
  const [region, setRegion] = useState<Region | null>(
    plan &&
      plan.schedule &&
      plan.schedule.length > 0 &&
      plan.schedule[0].place_list &&
      plan.schedule[0].place_list.length > 0
      ? {
          ...(plan!.schedule[0].place_list[0] as unknown as Place).location,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }
      : currentRegion
  );
  const radius = useMemo(() => {
    if (!region) return 0;
    return DEFAULT_RADIUS * region!.longitudeDelta * 10;
  }, [region]);

  // === Method ===
  const handleRegionChange = (region: Region) => {
    setRegion(region);
  };

  const handleSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return {
        ...(prev || {}),
        ...place.location,
        latitude: place.location.latitude,
      } as Region;
    });
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  /** スクロールする際のX軸の計算 */
  const calcScrollWidth = (place: Place) => {
    const CARD_WIDTH = 300;
    const index = placeList.findIndex((p) => p.id === place.id);
    return index * CARD_WIDTH;
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      if (!selectedPlace) {
        return;
      }
      scrollRef.current?.scrollTo({ x: calcScrollWidth(selectedPlace), animated: true });
    }, [selectedPlace])
  );

  // === Memo ===
  const placeList = useMemo(() => {
    return plan?.schedule.flatMap((schedule) => schedule.place_list as unknown as Place[]) || [];
  }, [plan]);

  // === Render ===
  return (
    <>
      <View className="w-screen h-screen absolute top-0 left-0">
        <View className="w-screen h-40 flex-1">
          <Map
            radius={radius}
            region={region || currentRegion}
            placeList={placeList}
            selectedPlaceList={placeList.filter((place) => place.id === selectedPlace?.id)}
            isMarker={true}
            isCallout={true}
            isCenterCircle={false}
            onRegionChange={handleRegionChange}
            onSelectedPlace={handleSelectedPlace}
          />
        </View>
        <View
          className={`absolute ${platform === 'ios' ? 'bottom-20' : 'bottom-40'} w-screen px-4 pt-2 pb-8`}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            snapToAlignment={'end'}
          >
            {plan?.schedule.map((schedule) => (
              <ScheduleInfoCard
                key={schedule.uid}
                schedule={schedule}
                onPress={handleSelectedPlace}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {isModalOpen && (
        <PlaceDetailModal
          place={selectedPlace!}
          isEdit={false}
          selected={false}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
