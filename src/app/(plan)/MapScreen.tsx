import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';
import { searchNearby, searchPlaceByText } from '@/src/apis/GoogleMaps';
import { usePlan } from '@/src/contexts/PlanContext';
import { Place } from '@/src/entities/Place';
import { router } from 'expo-router';
import { Header, Loading } from '@/src/components';
import ChatButton from '@/src/components/Header/ChatButton';
import PlaceCard from '@/src/components/PlaceCard';

/**
 * 初期表示
 *   1. プランの初期位置を取得
 *   2. 初期位置の施設情報を取得
 */
const MapScreen = () => {
  // ==== Member ====
  const { plan } = usePlan();
  const [isCoords, setIsCoords] = useState<Region>({
    ...JSON.parse(plan!.locations![0]),
    latitudeDelta: 0.05,
    longitudeDelta: 0.03,
  });
  const [centerCords, setCenterCords] = useState<Region>({
    ...JSON.parse(plan!.locations![0]),
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>();
  const [isLoading, setIsLoading] = useState(true);

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // ==== Method ====
  useEffect(() => {
    if (isCoords) fetchLocation(isCoords.latitude, isCoords.longitude);
  }, []);

  /** 施設情報設定処理 */
  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setPlaces(places);
    setSelectedPlace(places[0]);
  };

  /** 座標の施設情報取得 */
  const fetchLocation = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    try {
      const response = await searchNearby(latitude, longitude);
      settingPlaces(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** テキスト検索 実行処理 */
  const handleTextSearch = async (searchText: string) => {
    setIsLoading(true);
    try {
      const response = await searchPlaceByText(
        isCoords?.latitude || 0,
        isCoords?.longitude || 0,
        searchText
      );
      settingPlaces(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** 再検索 実行処理 */
  const handleResearch = async () => {
    setIsLoading(true);
    try {
      await fetchLocation(isCoords.latitude, isCoords.longitude);
      setCenterCords(isCoords);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** 場所を選択したときのイベントハンドラ */
  const handleSelectedPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsCoords((prev) => {
      return {
        ...prev,
        ...place.location,
      } as Region;
    });
  };

  // ==== Render ====
  return (
    <>
      {/* Map */}
      <View className=" w-full h-full">
        <Map
          places={places}
          region={isCoords}
          selectedPlace={selectedPlace}
          centerRegion={centerCords}
          selectPlace={(place: Place) => handleSelectedPlace(place)}
          setRegion={(region: Region) => setIsCoords((prev) => ({ ...prev, ...region }))}
          onPressReSearch={handleResearch}
          isSearch={true}
          onMarkerDeselect={() => {
            // setSelectedPlace(null);
          }}
        />
      </View>
      {/* 検索ヘッダー */}
      <View className="absolute top-16 px-4">
        <Header
          onBack={() => router.back()}
          onSearch={(text: string) => handleTextSearch(text)}
          rightComponent={<ChatButton />}
        />
      </View>
      {/* 選択対象の表示 */}
      <PlaceCard place={selectedPlace} />

      {/* ローディング */}
      {isLoading && <Loading />}
    </>
  );
};
export default MapScreen;
