import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, Linking, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place, Route, Step, useMap } from '@/src/features/map';
import Map from '@/src/features/map/components/Map';
import { NativeEventSubscription } from 'react-native';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import ScheduleBottomSheet from '@/src/features/map/components/ScheduleBottomSheet/ScheduleBottomSheet';
import PlaceBottomSheet from '@/src/features/map/components/PlaceBottomSheet/PlaceBottomSheet';
import { usePlan } from '@/src/contexts/PlanContext';
import { LogUtil } from '@/src/libs/LogUtil';
/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);

  const { plan, editSchedule, setEditSchedule } = usePlan();
  const {
    region,
    setRegion,
    selectedPlace,
    selectedPlaceList,
    doSelectedPlace,
    doSelectedCategory,
    radius,
  } = useMap();

  const { currentRegion } = useLocation();

  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [routeList, setRouteList] = useState<Route[]>([]);
  const [handleBackPress, setHandleBackPress] = useState<NativeEventSubscription | null>(null);

  const viewScheduleList: Schedule[] = useMemo(() => {
    return (
      plan?.schedule
        .filter((schedule) => schedule.place_list && schedule.place_list?.length > 0)
        .sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) || []
    );
  }, [plan]);

  const stepList: Step[] = useMemo(() => {
    if (!routeList || routeList.length === 0) return [];
    const [firstRoute] = routeList;
    if (!firstRoute || !firstRoute.legs || firstRoute.legs.length === 0) return [];
    return firstRoute.legs.flatMap((leg) => leg.steps || []);
  }, [routeList]);

  // === Method ===
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
    setEditSchedule(schedule);
  };

  /**
   * 経路表示ボトムシート 表示処理
   * @returns {void}
   */
  const handleDirectionView = useCallback(async () => {
    // GoogleMapの経路URLのリンク
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace?.displayName.text}`;
    Linking.openURL(url);
  }, [selectedPlace]);

  /**
   * 現在地を表示処理
   * @returns {void}
   */
  const handleShowCurrentLocation = () => {
    LogUtil.log('handleShowCurrentLocation', { level: 'info' });
    if (!currentRegion) return;
    setRegion({
      ...region,
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
    } as Region);
  };

  /**
   * バックボタンを押した場合は､画面を閉じるイベントハンドラを追加
   * @returns {void}
   */
  const setupBackPress = () => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    setHandleBackPress(backHandler);
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      setupBackPress();
      doSelectedCategory('selected');
      setEditSchedule(viewScheduleList[0] || null);
      return () => handleBackPress?.remove();
    }, [])
  );

  // === Render ===
  return (
    <>
      <View className="w-screen absolute top-0 left-0 h-[70%]">
        <Map
          placeList={[]}
          selectedPlaceList={selectedPlaceList}
          radius={radius}
          region={region}
          isMarker={true}
          isCallout={true}
          isCenterCircle={false}
          routeList={routeList}
          isRealTimePosition={true}
          onSelectedPlace={async (place: Place) => {
            doSelectedPlace(place);
          }}
          onRegionChange={handleRegionChange}
        />
      </View>
      {/* 場所詳細ボトムシート */}
      {viewMode === 'detail' && (
        <PlaceBottomSheet
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          isEdit={false}
          onDirection={handleDirectionView}
          onClose={() => setViewMode('list')}
        />
      )}
      {/* スケジュールボトムシート */}
      {viewMode === 'list' && (
        <ScheduleBottomSheet
          ref={bottomSheetRef}
          scrollRef={scrollRef as React.RefObject<BottomSheetScrollViewMethods>}
          scheduleList={viewScheduleList}
          selectedSchedule={editSchedule}
          selectedPlace={selectedPlace}
          selectedPlaceList={selectedPlaceList || []}
          onSelectedSchedule={handleSelectedSchedule}
          onSelectedPlace={async (place: Place) => {
            doSelectedPlace(place);
            setViewMode('detail');
          }}
        />
      )}
    </>
  );
}
