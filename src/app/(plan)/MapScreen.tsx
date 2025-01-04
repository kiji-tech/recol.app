import React, { useEffect, useState } from 'react';
import { TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';
import { CheckBox } from 'react-native-elements';
import { searchNearby, searchPlaceByText } from '@/src/apis/GoogleMaps';
import { usePlan } from '@/src/contexts/PlanContext';
import { Place } from '@/src/entities/Place';
import { router } from 'expo-router';
import { Header, Loading } from '@/src/components';
import ChatButton from '@/src/components/Header/ChatButton';

const MapScreen = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

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
      const response = await searchNearby(latitude, longitude, 6371 * isCoords.latitudeDelta);
      settingPlaces(response);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
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
      {selectedPlace && (
        <View className="absolute bottom-24 w-full">
          <View className="w-4/5 h-80 mx-auto  rounded-xl bg-light-background dark:bg-dark-background">
            {/* イメージ画像 */}
            <Image
              className={`w-full h-32 rounded-t-xl`}
              src={
                selectedPlace.photos
                  ? `https://places.googleapis.com/v1/${selectedPlace.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
                  : ''
              }
            />
            {/* body */}
            <View className="py-2 px-4 h-48">
              {/* /title */}
              <Text className="text-lg font-bold">{selectedPlace.displayName.text}</Text>
              {/* rate */}
              <Text>{selectedPlace.rating}</Text>
              {/* description */}
              <Text>{selectedPlace.editorialSummary?.text || ''}</Text>
              {/* button group */}
              <View className="m-4 flex flex-row justify-start items-center gap-2 absolute bottom-0">
                <TouchableOpacity
                  className="py-2 px-4 bg-light-theme dark:bg-dark-theme rounded-3xl"
                  onPress={() => router.navigate('/PlanList')}
                >
                  <Text className="text-sm">ウェブサイト</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 px-4 bg-light-theme dark:bg-dark-theme rounded-3xl">
                  <Text className="text-sm">AI</Text>
                </TouchableOpacity>
                <CheckBox title="" checked={false} onPress={() => {}} />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ローディング */}
      {isLoading && <Loading />}
    </>
  );
};
export default MapScreen;
