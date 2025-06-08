import React, { useCallback, useRef, useState } from 'react';
import Map from '@/src/components/GoogleMaps/Map';
import MapBottomSheet from '@/src/components/GoogleMaps/BottomSheet/MapBottomSheet';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { MapCategory } from '@/src/entities/MapCategory';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { searchNearby } from '@/src/apis/GoogleMaps';
import { Place } from '@/src/entities/Place';
import { useFocusEffect } from 'expo-router';
export default function SampleScreen() {
  const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const { currentRegion } = useLocation();
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // === Method ===
  /** ロケーション情報設定処理 */
  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setPlaceList(places);
    setSelectedPlace(null);
  };

  /** 座標のロケーション情報取得 */
  const fetchLocation = async (latitude: number, longitude: number) => {
    if (selectedCategory === 'selected') return;
    setIsLoading(true);
    try {
      const response = await searchNearby(latitude, longitude, selectedCategory, radius);
      settingPlaces(response);
    } finally {
      setIsLoading(false);
    }
  };

  /** カテゴリ選択 */
  const handleSelectedCategory = (category: MapCategory) => {
    setSelectedCategory(category);
    // 場所データの再取得
    if (selectedCategory === 'selected') return;
    fetchLocation(region!.latitude, region!.longitude);
  };

  /** 場所選択 */
  const handleSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return { ...(prev || {}), ...place.location } as Region;
    });
    setSelectedPlace(place);
  };

  // === Effect ===
  useFocusEffect(useCallback(() => {}, []));

  // === Render ===

  return (
    <>
      {/* 検索バー */}

      {/* マップ */}
      <Map
        region={region || currentRegion}
        placeList={placeList}
        selectedPlaceList={selectedPlaceList}
        isMarker={true}
        isCallout={true}
        isCenterCircle={true}
        onRegionChange={setRegion}
      />
      {/* マップボトムシート */}
      <MapBottomSheet
        placeList={placeList}
        selectedPlace={selectedPlace}
        selectedPlaceList={selectedPlaceList}
        selectedCategory={selectedCategory}
        isSelected={false}
        onAdd={() => {}}
        onRemove={() => {}}
        onSelectedPlace={handleSelectedPlace}
        onSelectedCategory={handleSelectedCategory}
        bottomSheetRef={bottomSheetRef}
        scrollRef={scrollRef}
      />
    </>
  );
}
