import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { usePlan } from '@/src/contexts/PlanContext';
import { IconButton, RateViewer } from '@/src/components';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place } from '@/src/entities/Place';
import { ScrollView } from 'react-native-gesture-handler';
import { Tables } from '@/src/libs/database.types';
import { DEFAULT_RADIUS, LATITUDE_OFFSET } from '@/src/libs/ConstValue';
import { useTheme } from '@/src/contexts/ThemeContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Map from '@/src/components/GoogleMaps/Map';

const ScheduleInfoCard = ({
  schedule,
  onPress,
}: {
  schedule: Tables<'schedule'>;
  onPress: (place: Place) => void;
}) => {
  // === Member ===
  const { isDarkMode } = useTheme();
  const placeList = useMemo(() => {
    return (schedule.place_list as unknown as Place[]) || [];
  }, [schedule]);

  // === Render ===
  if (placeList.length === 0) return null;
  return (
    <View className="flex flex-row gap-2">
      {placeList.map((place) => (
        <TouchableOpacity
          key={place.id}
          className="flex flex-col gap-2 rounded-md mr-4 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border w-80"
          onPress={() => onPress(place)}
        >
          {place.photos && place.photos.length > 0 && (
            <Image
              style={{
                width: '100%',
                height: 128,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
              source={`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(place.photos[0].name || '')}`}
            />
          )}
          <View className="px-4 py-2 flex flex-col gap-2">
            {/* タイトル */}
            <Text className="text-light-text dark:text-dark-text text-md w-full">
              {place.displayName.text}
            </Text>
            {/* 評価 */}
            <RateViewer rating={place.rating} />
            {/* ボタングループ */}
            <View className="flex flex-row justify-start items-center gap-4">
              {place.websiteUri && (
                <IconButton
                  icon={
                    <MaterialCommunityIcons
                      name="web"
                      size={18}
                      color={isDarkMode ? 'white' : 'black'}
                      className={`text-light-text dark:text-dark-text`}
                    />
                  }
                  theme="theme"
                  onPress={() => Linking.openURL(place.websiteUri)}
                />
              )}
              {place.googleMapsUri && (
                <IconButton
                  icon={
                    <FontAwesome5
                      name="map-marked-alt"
                      size={18}
                      color={isDarkMode ? 'white' : 'black'}
                      className={`text-light-text dark:text-dark-text`}
                    />
                  }
                  theme="theme"
                  onPress={() => Linking.openURL(place.googleMapsUri)}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
  const scrollRef = useRef<ScrollView>(null);
  const platform = Platform.OS;
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
        latitude: place.location.latitude - LATITUDE_OFFSET,
      } as Region;
    });
    setSelectedPlace(place);
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
  );
}
