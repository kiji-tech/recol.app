import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { Region } from 'react-native-maps';
import { useLocation } from '@/src/contexts/LocationContext';
import { Place, Direction, Route } from '@/src/features/map';
import { ScrollView } from 'react-native-gesture-handler';
import { DEFAULT_RADIUS } from '@/src/libs/ConstValue';
import Map from '@/src/features/map/components/Map';
import { fetchDirection } from '@/src/features/map/libs/direction';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';
import SelectedMapBottomSheet from '@/src/features/map/components/SelectedMapBottomSheet/SelectedMapBottomSheet';

/**
 * 初期表示
 */
export default function MapScreen() {
  // === Member ===
  const scrollRef = useRef<ScrollView>(null);
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
   * 場所選択処理
   * @param place {Place} 選択した場所
   */
  const handleSelectedPlace = (place: Place) => {
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
   * スケジュール情報カード選択処理
   * @param place {Place} 選択した場所
   */
  const handleSelectedInfoCard = async (place: Place) => {
    LogUtil.log('handleSelectedInfoCard', { level: 'info', notify: false });
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
   * スクロールする際のX軸の計算
   * @param place {Place} 選択した場所
   * @returns {number} スクロールする際のX軸の計算
   */
  const calcScrollWidth = (place: Place): number => {
    const CARD_WIDTH = 380;
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

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  // === Memo ===
  const placeList = useMemo(() => {
    return plan?.schedule.flatMap((schedule) => schedule.place_list as unknown as Place[]) || [];
  }, [plan]);

  // === Render ===
  return (
    <>
      <View className="w-screen absolute top-0 left-0 h-[70%]">
        <Map
          radius={radius}
          region={region || currentRegion}
          placeList={placeList}
          selectedPlaceList={placeList.filter((place) => place.id === selectedPlace?.id)}
          isMarker={true}
          isCallout={true}
          isCenterCircle={false}
          routeList={routeList}
          onRegionChange={handleRegionChange}
          onSelectedPlace={handleSelectedPlace}
        />
      </View>
      <SelectedMapBottomSheet
        placeList={placeList}
        selectedPlace={selectedPlace}
        onSelectedPlace={handleSelectedInfoCard}
      />
      {/* <View className={`absolute bottom-0 w-screen px-4 pt-2 pb-4 z-50`}>
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
              onPress={handleSelectedInfoCard}
            />
          ))}
        </ScrollView>
      </View> */}
      <ToastManager />
    </>
  );
}
