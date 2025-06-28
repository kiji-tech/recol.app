import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { usePlan } from '@/src/contexts/PlanContext';
import { RateViewer } from '@/src/components';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place } from '@/src/entities/Place';
import { ScrollView } from 'react-native-gesture-handler';
import { Tables } from '@/src/libs/database.types';
import { DEFAULT_RADIUS } from '@/src/libs/ConstValue';
import Map from '@/src/components/GoogleMaps/Map';

const ScheduleInfoCard = ({
  schedule,
  onPress,
}: {
  schedule: Tables<'schedule'>;
  onPress: (place: Place) => void;
}) => {
  const placeList = useMemo(() => {
    return (schedule.place_list as unknown as Place[]) || [];
  }, [schedule]);
  if (placeList.length === 0) return null;
  return (
    <View className="flex flex-col gap-2">
      <View className="px-4 py-2">
        <Text className="text-light-text dark:text-dark-text text-xl">【{schedule?.title}】</Text>
      </View>
      <View className="flex flex-row gap-2">
        {placeList.map((place) => (
          <TouchableOpacity
            key={place.id}
            className="flex flex-col gap-2 rounded-md mr-4 border border-light-border dark:border-dark-border"
            onPress={() => onPress(place)}
          >
            {place.photos && place.photos.length > 0 && (
              <Image
                style={{
                  width: 256,
                  height: 128,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                source={`https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`}
              />
            )}
            <View className="p-2">
              {/* タイトル */}
              <Text className="text-light-text dark:text-dark-text text-md w-full">
                {place.displayName.text}
              </Text>
              {/* 評価 */}
              <RateViewer rating={place.rating} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
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
    console.log({ place: place.displayName.text });
    setSelectedPlace(place);
    setRegion((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...place.location,
      };
    });
  };

  // === Memo ===
  const placeList = useMemo(() => {
    return plan?.schedule.flatMap((schedule) => schedule.place_list as unknown as Place[]) || [];
  }, [plan]);

  // === Render ===
  return (
    <View className="w-screen h-screen absolute top-0 left-0 mt-20">
      <View className="w-screen flex-1">
        <Map
          radius={radius}
          region={region || currentRegion}
          placeList={placeList}
          selectedPlaceList={placeList.filter((place) => place.id === selectedPlace?.id)}
          isMarker={true}
          isCallout={true}
          isCenterCircle={true}
          onRegionChange={handleRegionChange}
        />
      </View>
      <View className="absolute bottom-40 w-screen bg-light-background dark:bg-dark-background rounded-t-3xl py-4">
        <ScrollView
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
  );
}
