import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place, Direction, Route, Step, useMap } from '@/src/features/map';
import Map from '@/src/features/map/components/Map';
import { fetchDirection } from '@/src/features/map/libs/direction';
import { Toast } from 'toastify-react-native';
import { NativeEventSubscription } from 'react-native';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import ScheduleBottomSheet from '@/src/features/map/components/ScheduleBottomSheet/ScheduleBottomSheet';
import DirectionBottomSheet from '@/src/features/map/components/DirectionBottomSheet/DirectionBottomSheet';
import { DirectionMode } from '@/src/features/map/types/Direction';
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

  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'direction'>('list');
  const [routeList, setRouteList] = useState<Route[]>([]);
  const [isLoadingDirection, setIsLoadingDirection] = useState(false);
  const [handleBackPress, setHandleBackPress] = useState<NativeEventSubscription | null>(null);

  const viewScheduleList: Schedule[] = useMemo(() => {
    return (
      plan?.schedule
        .filter((schedule) => schedule.place_list && schedule.place_list?.length > 0)
        .sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) || []
    );
  }, [plan]);
  const [selectedMode, setSelectedMode] = useState<DirectionMode>('walking');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  const stepList: Step[] = useMemo(() => {
    if (!routeList || routeList.length === 0) return [];
    const [firstRoute] = routeList;
    if (!firstRoute || !firstRoute.legs || firstRoute.legs.length === 0) return [];
    return firstRoute.legs.flatMap((leg) => leg.steps || []);
  }, [routeList]);

  // === Method ===
  /**
   * 経路設定処理
   * @param place {Place} 選択した場所
   * @param mode {DirectionMode} 交通手段
   * @returns {void}
   */
  const setupDirections = useCallback(
    async (place: Place, mode?: DirectionMode) => {
      setIsLoadingDirection(true);
      try {
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
      } finally {
        setIsLoadingDirection(false);
      }
    },
    [currentRegion]
  );

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
    if (!selectedPlace) return;
    setViewMode('direction');
    await setupDirections(selectedPlace!, selectedMode);
  }, [selectedPlace, selectedMode]);

  /**
   * 経路表示ボトムシート クローズ処理
   * @returns {void}
   */
  const handleCloseDirectionView = () => {
    setViewMode('detail');
    setRouteList([]);
    setSelectedStepIndex(null);
  };

  /**
   * 経路表示ボトムシート Step選択処理
   * @param index {number} 選択したStepのインデックス
   * @returns {void}
   */
  const handleStepSelect = (index: number) => {
    setSelectedStepIndex(index);
    // 経路マーカーを選択したStepのマーカーに移動
    const step = stepList[index];
    if (step) {
      setRegion({
        ...region,
        latitude: step.start_location.lat,
        longitude: step.start_location.lng,
      } as Region);
    }
  };

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
   * 経路表示ボトムシート 経路モード選択処理
   * @param mode {DirectionMode} 選択した経路モード
   */
  const handleSelectedDirectionMode = (mode: DirectionMode) => {
    setSelectedMode(mode);
    setRouteList([]);
    setSelectedStepIndex(0);
    setupDirections(selectedPlace!, mode);
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
          selectedStepIndex={selectedStepIndex}
          onSelectedPlace={async (place: Place) => {
            doSelectedPlace(place);
            /** 経路表示ボトムシートなら経路を取得 */
            if (viewMode === 'direction') {
              await setupDirections(place, selectedMode);
              return;
            }
          }}
          onRegionChange={handleRegionChange}
        />
      </View>
      {/* 経路表示ボトムシート */}
      {viewMode === 'direction' && (
        <DirectionBottomSheet
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          selectedPlace={selectedPlace!}
          selectedMode={selectedMode}
          stepList={stepList}
          selectedStepIndex={selectedStepIndex}
          isLoading={isLoadingDirection}
          onSelectedMode={handleSelectedDirectionMode}
          onShowCurrentLocation={handleShowCurrentLocation}
          onStepSelect={handleStepSelect}
          onClose={handleCloseDirectionView}
        />
      )}
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
