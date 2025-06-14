import React, { useCallback, useMemo, useRef } from 'react';
import Map from '@/src/components/GoogleMaps/Map';
import { Place } from '@/src/entities/Place';
import { useState } from 'react';
import { View } from 'react-native';
import { searchNearby, searchPlaceByText } from '@/src/apis/GoogleMaps';
import MapBottomSheet from '@/src/components/GoogleMaps/BottomSheet/MapBottomSheet';
import { useLocation } from '@/src/contexts/LocationContext';
import { MapCategory } from '@/src/entities/MapCategory';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { Region } from 'react-native-maps';
import { usePlan } from '@/src/contexts/PlanContext';
import { LATITUDE_OFFSET } from '@/src/libs/ConstValue';
import MapSearchBar from '@/src/components/GoogleMaps/MapSearchBar';
import { Tables } from '@/src/libs/database.types';
import { LogUtil } from '@/src/libs/LogUtil';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MapModal({ isOpen, onClose }: Props) {
  // === Member ===
  const DEFAULT_RADIUS = 4200;
  const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const { currentRegion } = useLocation();
  const { editSchedule, setEditSchedule } = usePlan();
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  /** Map上の半径の計算 */
  const radius = useMemo(() => {
    if (!region) return 0;
    return DEFAULT_RADIUS * region!.longitudeDelta * 10;
  }, [region]);

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
      const response = await searchNearby(
        latitude + LATITUDE_OFFSET,
        longitude,
        selectedCategory,
        radius
      );
      settingPlaces(response);
    } finally {
      setIsLoading(false);
    }
  };

  /** カテゴリ選択 */
  const handleSelectedCategory = (category: MapCategory) => {
    setSelectedCategory(category);
    setPlaceList([]);
  };

  /** 場所選択 */
  const handleSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return { ...(prev || {}), ...place.location } as Region;
    });
    setSelectedPlace(place);
  };

  /** テキスト検索 実行処理 */
  const handleTextSearch = async (searchText: string) => {
    setIsLoading(true);
    setSelectedCategory('text');
    try {
      const response = await searchPlaceByText(
        region?.latitude || 0,
        region?.longitude || 0,
        searchText,
        radius
      );
      settingPlaces(response);
    } finally {
      setIsLoading(false);
    }
  };

  /** スケジュールに対する場所の追加 */
  const handleAdd = (place: Place) => {
    setEditSchedule({
      ...editSchedule,
      place_list: [...(editSchedule?.place_list || []), place],
    } as unknown as Tables<'schedule'>);
  };

  /** スケジュールに対する場所の削除 */
  const handleRemove = (place: Place) => {
    setEditSchedule({
      ...editSchedule,
      place_list: (editSchedule?.place_list || []).filter(
        (p: unknown) => (p as Place).id !== place.id
      ),
    } as unknown as Tables<'schedule'>);
  };

  /** モーダルを閉じる */
  const handleClose = () => {
    onClose();
  };

  // === Effect ===
  /** 初回ロケーション情報取得処理 */
  useFocusEffect(
    useCallback(() => {
      if (currentRegion) {
        setRegion(
          editSchedule?.place_list?.length > 0
            ? {
                ...editSchedule?.place_list[0].location,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
              }
            : currentRegion
        );
        fetchLocation(currentRegion.latitude, currentRegion.longitude);
      }
    }, [currentRegion])
  );

  /** カテゴリ変更時にロケーション情報取得処理 */
  useFocusEffect(
    useCallback(() => {
      if (region) {
        fetchLocation(region.latitude, region.longitude);
      }
    }, [selectedCategory])
  );

  // === Render ===
  if (!isOpen || !currentRegion) return null;
  return (
    <>
      <View className=" w-screen h-screen absolute top-0 left-0 mt-20">
        {/* 検索バー */}
        <MapSearchBar
          radius={radius}
          region={region || currentRegion}
          currentRegion={currentRegion}
          isSearch={true}
          onSearch={handleTextSearch}
          onBack={handleClose}
        />

        {/* マップ */}
        <View className="w-screen h-screen absolute top-0 left-0">
          <Map
            radius={radius}
            region={region || currentRegion}
            placeList={placeList}
            selectedPlaceList={(editSchedule?.place_list as unknown as Place[]) || []}
            isMarker={true}
            isCallout={true}
            isCenterCircle={true}
            onRegionChange={setRegion}
            onSelectedPlace={handleSelectedPlace}
          />
        </View>
        {/* マップボトムシート */}
        <MapBottomSheet
          placeList={placeList}
          selectedPlace={selectedPlace}
          selectedPlaceList={(editSchedule?.place_list as unknown as Place[]) || []}
          selectedCategory={selectedCategory}
          isSelected={selectedCategory === 'selected'}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onSelectedPlace={handleSelectedPlace}
          onSelectedCategory={handleSelectedCategory}
          bottomSheetRef={bottomSheetRef}
          scrollRef={scrollRef}
        />
      </View>
    </>
  );
}
