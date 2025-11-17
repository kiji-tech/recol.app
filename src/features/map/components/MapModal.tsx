import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map from '@/src/features/map/components/Map';
import { Place } from '@/src/features/map/types/Place';
import { BackHandler, Platform, View } from 'react-native';
import MapBottomSheet from './BottomSheet/MapBottomSheet';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { useFocusEffect } from 'expo-router';
import ResearchButton from './ResearchButton';
import { SCROLL_EVENT_TIMEOUT } from '@/src/libs/ConstValue';
import { Header } from '@/src/components';
import PlaceBottomSheet from './PlaceBottomSheet/PlaceBottomSheet';
import { useMap } from '../hooks/useMap';
import { useLocation } from '@/src/contexts/LocationContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MapModal({ isOpen, onClose }: Props) {
  // === Member ===
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
  const { currentRegion } = useLocation();
  const [isDetailPlace, setIsDetailPlace] = useState(false);
  const {
    searchPlaceList,
    selectedPlace,
    selectedPlaceList,
    clearSelectedPlace,
    handleTextSearch,
    handleResearch,
    handleSelectedCategory,
    handleSelectedPlace,
    region,
    setRegion,
    radius,
  } = useMap();
  const isIOS = Platform.OS === 'ios';

  // === Method ===

  /** マップ選択時のスクロール位置計算 */
  const calcScrollHeight = useCallback(
    (selectedPlace: Place) => {
      const PLACE_HEIGHT = 113;
      const index = searchPlaceList.findIndex((place: Place) => place.id === selectedPlace.id);
      const selectedIndex = selectedPlaceList
        ? selectedPlaceList.findIndex((place: Place) => place.id === selectedPlace.id)
        : -1;
      if (selectedIndex !== -1) {
        handleSelectedCategory('selected');
        return selectedIndex * PLACE_HEIGHT;
      }
      return index * PLACE_HEIGHT;
    },
    [searchPlaceList, selectedPlaceList]
  );

  /** 場所詳細ボトムシート 閉じる処理 */
  const handleCloseDetailPlace = () => {
    setIsDetailPlace(false);
    clearSelectedPlace();
  };

  /** モーダルを閉じる */
  const handleClose = (): undefined => {
    onClose();
  };

  // === Effect ===
  /**
   * バックボタンを押した場合は､モーダルを閉じるイベントハンドラを追加
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      handleClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  /**
   * マップ選択時のスクロール位置計算
   */
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

  // === Render ===
  if (!isOpen) return null;
  return (
    <View className="w-full h-full absolute top-0 left-0">
      {/* 検索ヘッダー */}
      <View className={`w-full h-12 absolute z-50 px-2 ${isIOS ? 'top-20' : 'top-4'}`}>
        <Header onBack={() => handleClose()} onSearch={handleTextSearch} />
      </View>

      {/* 再検索 */}
      <ResearchButton
        centerRegion={region || currentRegion || null}
        currentRegion={currentRegion || null}
        radius={radius}
        onPress={handleResearch}
      />

      {/* マップ */}
      <View style={{ height: '70%' }} className="w-screen absolute top-0 left-0">
        <Map
          placeList={searchPlaceList}
          selectedPlaceList={selectedPlaceList}
          radius={radius}
          region={region || currentRegion}
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
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          scrollRef={scrollRef as React.RefObject<BottomSheetScrollViewMethods>}
          onSelectedPlace={(place: Place) => {
            handleSelectedPlace(place);
            setIsDetailPlace(true);
          }}
        />
      )}
      {isDetailPlace && (
        <PlaceBottomSheet
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          isEdit={true}
          onClose={handleCloseDetailPlace}
        />
      )}
    </View>
  );
}
