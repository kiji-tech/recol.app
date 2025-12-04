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
import { LogUtil } from '@/src/libs/LogUtil';
import { MapCategory } from '../types/MapCategory';
import RateLimitModal from './RateLimitModal';
import PostPlaceModal from '../../posts/components/PostPlaceModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MapModal({ isOpen, onClose }: Props) {
  // === Member ===
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
  const { currentRegion } = useLocation();
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [isDetailPlace, setIsDetailPlace] = useState(false);
  const [isRateLimit, setIsRateLimit] = useState(false);
  const {
    searchPlaceList,
    selectedPlace,
    selectedPlaceList,
    checkRateLimit,
    doTextSearch,
    doResearch,
    doSelectedPlace,
    doSelectedCategory,
    region,
    setRegion,
    radius,
    selectedCategory,
  } = useMap();
  const isIOS = Platform.OS === 'ios';

  // === Method ===
  /**
   * マップ選択時のスクロール位置計算
   */
  const calcScrollHeight = useCallback(
    (selectedPlace: Place) => {
      const PLACE_HEIGHT = 140;
      // 選択状態の場合は､selectedPlaceListからインデックスを取得
      if (selectedCategory === 'selected') {
        const selectedIndex = selectedPlaceList
          ? selectedPlaceList.findIndex((place: Place) => place.id === selectedPlace.id)
          : -1;
        return selectedIndex * PLACE_HEIGHT;
      }

      const index = searchPlaceList.findIndex((place: Place) => place.id === selectedPlace.id);
      return index * PLACE_HEIGHT;
    },
    [searchPlaceList, selectedPlaceList]
  );

  /**
   * 再検索 イベントハンドラ
   */
  const handleResearch = async () => {
    const rateLimit = await checkRateLimit();
    if (!rateLimit) {
      // 動画視聴しますかのモーダルを表示する
      setIsRateLimit(true);
      return;
    }
    doResearch();
  };

  /**
   * 選択場所 イベントハンドラ
   * @param place {Place} 選択場所
   */
  const handleSelectedPlace = (place: Place) => {
    doSelectedPlace(place);
  };

  /**
   * 検索 イベントハンドラ
   * @param text {string} 検索文字列
   */
  const handleTextSearch = async (text: string) => {
    const rateLimit = await checkRateLimit();
    if (!rateLimit) {
      // 動画視聴しますかのモーダルを表示する
      setIsRateLimit(true);
      return;
    }
    doTextSearch(text);
  };

  /**
   * 選択カテゴリー イベントハンドラ
   * @param category {MapCategory} 選択カテゴリー
   */
  const handleSelectedCategory = async (category: MapCategory) => {
    const rateLimit = await checkRateLimit();
    LogUtil.log(`${JSON.stringify({ rateLimit })}`);
    if (!rateLimit) {
      // 動画視聴しますかのモーダルを表示する
      setIsRateLimit(true);
      return;
    }
    doSelectedCategory(category);
  };

  /**
   * 場所詳細ボトムシート 閉じる処理
   */
  const handleCloseDetailPlace = () => {
    LogUtil.log('handleCloseDetailPlace', { level: 'info' });
    setIsDetailPlace(false);
  };

  /**
   * モーダルを閉じる
   */
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
    <View className="w-full h-full absolute top-0 left-0 z-2">
      {/* 検索ヘッダー */}
      <View className={`w-full h-12 absolute z-50 px-2 ${isIOS ? 'top-20' : 'top-4'}`}>
        <Header onBack={() => handleClose()} onSearch={handleTextSearch} />
      </View>
      {/* 再検索 */}
      <ResearchButton
        centerRegion={region || null}
        currentRegion={currentRegion || null}
        radius={radius}
        onPress={() => handleResearch}
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
      {/* リミットレートオーバー */}
      {isRateLimit && <RateLimitModal isOpen={isRateLimit} onClose={() => setIsRateLimit(false)} />}
      {/* マップボトムシート */}
      {!isDetailPlace && (
        <MapBottomSheet
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          scrollRef={scrollRef as React.RefObject<BottomSheetScrollViewMethods>}
          onSelectedCategory={(category: MapCategory) => {
            handleSelectedCategory(category);
          }}
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
          onPost={() => setPostModalVisible(true)}
          onClose={handleCloseDetailPlace}
        />
      )}
      {/* ポストモーダル */}
      {postModalVisible && (
        <PostPlaceModal place={selectedPlace!} onClose={() => setPostModalVisible(false)} />
      )}
    </View>
  );
}
