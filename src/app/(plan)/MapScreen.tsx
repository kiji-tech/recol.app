import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place, Direction, Route } from '@/src/features/map';
import { DEFAULT_RADIUS } from '@/src/libs/ConstValue';
import Map from '@/src/features/map/components/Map';
import { fetchDirection } from '@/src/features/map/libs/direction';
import ToastManager, { Toast } from 'toastify-react-native';
import { NativeEventSubscription } from 'react-native';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import ScheduleBottomSheet from '@/src/features/map/components/ScheduleBottomSheet/ScheduleBottomSheet';

/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);
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
  const [routeList, setRouteList] = useState<Route[]>([]);
  const [handleBackPress, setHandleBackPress] = useState<NativeEventSubscription | null>(null);

  const viewScheduleList: Schedule[] = useMemo(() => {
    return (
      plan?.schedule
        .filter((schedule) => schedule.place_list?.length > 0)
        .sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) || []
    );
  }, [plan]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    viewScheduleList[0] || null
  );

  // === Method ===
  /**
   * 経路設定処理
   * @param place {Place} 選択した場所
   * @param mode {'walking' | 'driving' | 'transit'} 交通手段
   * @returns {void}
   */
  const setupDirections = async (
    place: Place,
    mode: 'walking' | 'driving' | 'transit' = 'walking'
  ) => {
    const directions: Direction = await fetchDirection(
      `${currentRegion?.latitude},${currentRegion?.longitude}`,
      `${place.location.latitude},${place.location.longitude}`,
      mode
    );
    if (directions.status !== 'OK' || !directions.routes || directions.routes.length === 0) {
      Toast.warn('経路の取得に失敗しました｡');
      setRouteList([]);
      return;
    }
    setRouteList(directions.routes);
  };

  /**
   * リージョン変更処理
   * @param region {Region} 移動したリージョン
   */
  const handleRegionChange = (region: Region) => {
    setRegion(region);
  };

  /**
   * スケジュール選択処理
   * @param schedule {Schedule} 選択したスケジュール
   * @returns {void}
   */
  const handleSelectedSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  /**
   * 場所選択処理
   * @param place {Place} 選択した場所
   */
  const handleSelectedPlace = async (place: Place) => {
    setupDirections(place);
    setRegion((prev) => {
      return {
        ...(prev || {}),
        ...place.location,
        latitude: place.location.latitude,
      } as Region;
    });
    setSelectedPlace(place);
  };

  /**
   * バックボタンを押した場合は､画面を閉じるイベントハンドラを追加
   * @returns {void}
   */
  const handleAddBackPress = () => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    setHandleBackPress(backHandler);
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      handleAddBackPress();
      return () => handleBackPress?.remove();
    }, [])
  );

  // === Render ===
  return (
    <>
      <View className="w-screen absolute top-0 left-0 h-[70%]">
        <Map
          radius={radius}
          region={region || currentRegion}
          placeList={selectedSchedule?.place_list || []}
          selectedPlaceList={
            selectedSchedule?.place_list?.filter(
              (place: Place) => place.id === selectedPlace?.id
            ) || []
          }
          isMarker={true}
          isCallout={true}
          isCenterCircle={false}
          routeList={routeList}
          onRegionChange={handleRegionChange}
          onSelectedPlace={handleSelectedPlace}
        />
      </View>
      <ScheduleBottomSheet
        ref={bottomSheetRef}
        scrollRef={scrollRef as React.RefObject<BottomSheetScrollViewMethods>}
        scheduleList={viewScheduleList}
        selectedSchedule={selectedSchedule}
        selectedPlace={selectedPlace}
        onSelectedSchedule={handleSelectedSchedule}
        onSelectedPlace={handleSelectedPlace}
      />
      <ToastManager />
    </>
  );
}
