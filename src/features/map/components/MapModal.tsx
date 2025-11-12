import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Map from '@/src/features/map/components/Map';
import { Place } from '@/src/features/map/types/Place';
import { BackHandler, Platform, View } from 'react-native';
import { Region } from 'react-native-maps';
import { searchNearby, searchPlaceByText } from '@/src/features/map';
import MapBottomSheet from './BottomSheet/MapBottomSheet';
import { useLocation } from '@/src/contexts/LocationContext';
import { MapCategory } from '@/src/features/map/types/MapCategory';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { useAuth } from '@/src/features/auth';
import ResearchButton from './ResearchButton';
import { SCROLL_EVENT_TIMEOUT } from '@/src/libs/ConstValue';
import { Header } from '@/src/components';
import { Schedule } from '@/src/features/schedule';
import PlaceBottomSheet from './PlaceBottomSheet/PlaceBottomSheet';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MapModal({ isOpen, onClose }: Props) {
  // === Member ===
  const DEFAULT_RADIUS = 4200;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
  const { session } = useAuth();
  const { currentRegion } = useLocation();
  const { editSchedule, setEditSchedule } = usePlan();
  const [searchPlaceList, setSearchPlaceList] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailPlace, setIsDetailPlace] = useState(false);
  const isIOS = Platform.OS === 'ios';

  // === Method ===
  /** ロケーション情報設定処理 */
  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setSearchPlaceList(places);
    setSelectedPlace(null);
  };

  /** 座標のロケーション情報取得 */
  const fetchLocation = async (latitude: number, longitude: number) => {
    setSearchPlaceList([]);
    if (selectedCategory === 'selected' || selectedCategory === 'text') return;
    setIsLoading(true);
    try {
      const placeList = await searchNearby(session, latitude, longitude, selectedCategory, radius);
      settingPlaces(placeList);
    } finally {
      setIsLoading(false);
    }
  };

  /** マップ選択時のスクロール位置計算 */
  const calcScrollHeight = (selectedPlace: Place) => {
    const PLACE_HEIGHT = 113;
    const index = searchPlaceList.findIndex((place) => place.id === selectedPlace.id);
    const selectedIndex = selectedPlaceList
      ? selectedPlaceList.findIndex((place) => place.id === selectedPlace.id)
      : -1;
    if (selectedIndex !== -1) {
      setSelectedCategory('selected');
      return selectedIndex * PLACE_HEIGHT;
    }
    return index * PLACE_HEIGHT;
  };

  /** カテゴリ選択 */
  const handleSelectedCategory = (category: MapCategory) => {
    setSelectedCategory(category);
  };

  /** 場所選択 */
  const handleSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return {
        ...(prev || {}),
        ...place.location,
        latitude: place.location.latitude,
      } as Region;
    });
    setSelectedPlace(place);
    setIsDetailPlace(true);
  };

  /** 場所詳細ボトムシート 閉じる処理 */
  const handleCloseDetailPlace = () => {
    setIsDetailPlace(false);
    setSelectedPlace(null);
  };

  /** テキスト検索 実行処理 */
  const handleTextSearch = async (searchText: string) => {
    setIsLoading(true);
    setSearchPlaceList([]);
    setSelectedCategory('text');
    try {
      const response = await searchPlaceByText(
        session,
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

  /** エリアで再検索 */
  const handleResearch = async () => {
    await fetchLocation(region?.latitude || 0, region?.longitude || 0);
  };

  /** スケジュールに対する場所の追加 */
  const handleAdd = (place: Place) => {
    setEditSchedule({
      ...editSchedule,
      place_list: [...(editSchedule?.place_list || []), place],
    } as Schedule & { place_list: Place[] });
  };

  /** スケジュールに対する場所の削除 */
  const handleRemove = (place: Place) => {
    setEditSchedule({
      ...editSchedule,
      place_list: (editSchedule?.place_list || []).filter((p: Place) => p.id !== place.id),
    } as Schedule & { place_list: Place[] });
  };

  /** モーダルを閉じる */
  const handleClose = () => {
    onClose();
  };

  // === Effect ===

  /**
   * バックボタンを押した場合は､モーダルを閉じるイベントハンドラを追加
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedPlaceList((editSchedule?.place_list as unknown as Place[]) || []);
    }, [editSchedule?.place_list])
  );

  /** 初回ロケーション情報取得処理 */
  useFocusEffect(
    useCallback(() => {
      if (currentRegion) {
        setRegion(
          editSchedule?.place_list && editSchedule?.place_list.length > 0
            ? {
                ...(editSchedule?.place_list[0] as unknown as Place).location,
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

  /** マップ選択時のスクロール位置計算 */
  useFocusEffect(
    useCallback(() => {
      if (!selectedPlace) return;
      // ボトムシートが開いている状態じゃないと､スクロールイベントが発生しない
      bottomSheetRef.current?.expand({});
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, y: calcScrollHeight(selectedPlace), animated: true });
      }, SCROLL_EVENT_TIMEOUT);
    }, [selectedPlace])
  );

  /** Map上の半径の計算 */
  const radius = useMemo(() => {
    if (!region) return 0;
    return DEFAULT_RADIUS * region!.longitudeDelta * 10;
  }, [region]);

  // === Render ===
  if (!isOpen || !currentRegion) return null;
  return (
    <View className=" w-screen h-screen absolute top-0 left-0">
      {/* 検索ヘッダー */}
      <View className={`w-full h-12 absolute z-50 px-2 ${isIOS ? 'top-20' : 'top-4'}`}>
        <Header onBack={handleClose} onSearch={handleTextSearch} />
      </View>

      {/* 再検索 */}
      <ResearchButton
        centerRegion={region || currentRegion}
        currentRegion={currentRegion}
        radius={radius}
        onPress={handleResearch}
      />

      {/* マップ */}
      <View style={{ height: '70%' }} className="w-screen absolute top-0 left-0">
        <Map
          radius={radius}
          region={region || currentRegion}
          placeList={searchPlaceList}
          selectedPlaceList={selectedPlaceList || []}
          isMarker={true}
          isCallout={true}
          isCenterCircle={true}
          onRegionChange={setRegion}
          onSelectedPlace={handleSelectedPlace}
        />
      </View>

      {/* マップボトムシート */}
      {!isDetailPlace && (
        <MapBottomSheet
          placeList={searchPlaceList}
          selectedPlace={selectedPlace}
          selectedPlaceList={selectedPlaceList || []}
          selectedCategory={selectedCategory}
          isSelected={selectedCategory === 'selected'}
          isLoading={isLoading}
          onSelectedPlace={handleSelectedPlace}
          onSelectedCategory={handleSelectedCategory}
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          scrollRef={scrollRef as React.RefObject<BottomSheetScrollViewMethods>}
        />
      )}
      {isDetailPlace && (
        <PlaceBottomSheet
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          selectedPlace={selectedPlace!}
          isEdit={true}
          selected={selectedPlaceList.findIndex((place) => place.id === selectedPlace?.id) >= 0}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClose={handleCloseDetailPlace}
        />
      )}
    </View>
  );
}
