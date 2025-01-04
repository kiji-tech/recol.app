import Map from '@components/GoogleMaps/Map';
import { CheckBox } from 'react-native-elements';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';
import { searchNearby, searchPlaceByText } from '@/src/apis/GoogleMaps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import Loading from '@/src/components/Loading';
import { usePlan } from '@/src/contexts/PlanContext';
import { Place } from '@/src/entities/Place';
import BackButton from '@/src/components/BackButton';
import { router } from 'expo-router';
import IconButton from '@/src/components/IconButton';

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
  const [searchText, setSearchText] = useState('');
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

  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setPlaces(places);
    setSelectedPlace(places[0]);
  };

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

  const handleTextSearch = async () => {
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

  const handleChangeMap = async (region: Region) => {
    setIsCoords((prev) => ({ ...prev, ...region }));
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
      <View className=" w-full h-full">
        <Map
          places={places}
          region={isCoords}
          selectedPlace={selectedPlace}
          centerRegion={centerCords}
          selectPlace={(place: Place) => handleSelectedPlace(place)}
          setRegion={handleChangeMap}
          onPressReSearch={handleResearch}
          isSearch={true}
          onMarkerDeselect={() => {
            // setSelectedPlace(null);
          }}
        />
      </View>
      <View className="absolute top-20 left-4">
        {/* バックボタン */}
        <View className="flex flex-row justify-start">
          <BackButton url="/planList" />
          <View
            className={`
                flex flex-row justify-start rounded-xl items-center
                px-4 py-2 bg-light-background dark:bg-dark-background `}
          >
            {/* 検索バー */}
            {/* TODO ダークモードのときの色変更 */}
            <MaterialIcons className={`opacity-30`} name="search" size={24} color="#25292e" />
            <TextInput
              defaultValue={searchText}
              onChangeText={(n) => setSearchText(n)}
              placeholder="検索"
              onBlur={() => handleTextSearch()}
              returnKeyType="search"
              className={`w-[70%] ml-2 rounded-xl text-m text-light-text dark:text-dark-text`}
            />
          </View>
        </View>
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
                  //   onPress={() => router.navigate('/planList')}
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

      {/* チャットボタン */}
      <TouchableOpacity>
        <View className="absolute bottom-10 right-4">
          <IconButton
            icon="chat"
            onPress={() => {
              router.push('/(chat)/ChatScreen');
            }}
          />
        </View>
      </TouchableOpacity>
      {/* ローディング */}
      {isLoading && <Loading />}
    </>
  );
};
export default MapScreen;
