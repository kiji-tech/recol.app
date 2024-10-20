import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';
import { searchNearby, searchText } from '@/src/apis/GoogleMaps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundView } from '@/src/components';
import BackButtonHeader from '@/src/components/BackButtonHeader';
import Loading from '@/src/components/Loading';
import { usePlan } from '@/src/contexts/PlanContext';
import IconCheckButton from '@/src/components/IconCheckButton';
import PlaceInfo from '@/src/components/GoogleMaps/PlaceInfo';
import { Place } from '@/src/entities/Place';

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

  const [isCoffee, setIsCoffee] = useState(true);
  const [isHotel, setIsHotel] = useState(true);
  const [isPark, setIsPark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [places, setPlaces] = useState<Place[]>();
  const ref = useRef(null);
  const router = useRouter();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // 条件が変わったら再検索
  useEffect(() => {
    if (isCoords) {
      // 旅行先のロケーションを検索する
      searchNearby(
        isCoords.latitude,
        isCoords.longitude,
        40000 * isCoords.latitudeDelta,
        isCoffee,
        isHotel
      )
        .then((response) => {
          settingPlaces(response);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isCoffee, isHotel, isPark]);

  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setPlaces(places);
    setSelectedPlace(places[0]);
  };

  const fetchLocation = async (latitude: number, longitude: number) => {
    const response = await searchNearby(
      latitude,
      longitude,
      6371 * isCoords.latitudeDelta,
      true,
      false
    );
    settingPlaces(response);
  };

  const handleTextSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchText(isCoords?.latitude || 0, isCoords?.longitude || 0, text);
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
    console.log(place);
    setSelectedPlace(place);
    setIsCoords((prev) => {
      return {
        ...prev,
        ...place.location,
      } as Region;
    });
    // refでスクールの位置を変更する
    const index = places!.findIndex((p: Place) => p.id === place.id);
    if (index !== -1) {
      (ref.current! as any).scrollTo({
        x: Math.max((384 - 24) * index, 0),
        animation: true,
      });
    }
  };

  if (isLoading && !selectedPlace) {
    return <Loading />;
  }

  return (
    <SafeAreaView>
      <BackgroundView>
        {/* 検索バー */}
        <BackButtonHeader onPress={() => router.back()}>
          <View
            className={`
                flex flex-row justify-between rounded-xl items-center
                px-4 py-2 ml-4 bg-light-background dark:bg-dark-background `}
          >
            {/* TODO ダークモードのときの色変更 */}
            <MaterialIcons className={`opacity-30`} name="search" size={24} color="#25292e" />
            <TextInput
              defaultValue={text}
              onChangeText={(n) => setText(n)}
              placeholder="検索"
              onBlur={() => handleTextSearch()}
              returnKeyType="search"
              className={`w-full rounded-xl text-md pl-2 text-light-text dark:text-dark-text`}
            />
          </View>
        </BackButtonHeader>
        {/* マップオブジェクト */}
        <View className=" w-full h-[400px]">
          <Map
            places={places}
            region={isCoords}
            centerRegion={centerCords}
            selectPlace={(place) => handleSelectedPlace(place)}
            setRegion={handleChangeMap}
            onPressReSearch={handleResearch}
          />
        </View>
        {/* TODO ボタン群 */}
        <View className="w-full flex flex-row justify-center items-center gap-8 ">
          <IconCheckButton
            icon="coffee"
            checked={isCoffee}
            onPress={() => setIsCoffee((prev) => !prev)}
          />
          <IconCheckButton
            icon="hotel"
            checked={isHotel}
            onPress={() => setIsHotel((prev) => !prev)}
          />
          <IconCheckButton
            icon="park"
            checked={isPark}
            onPress={() => setIsPark((prev) => !prev)}
          />
        </View>
        {/* 検索結果一覧 */}
        <ScrollView ref={ref} horizontal={true} bounces={false}>
          <View className={`flex flex-row flex-nowrap gap-8 w-full`}>
            {places &&
              places.map((place: Place) => {
                return (
                  <PlaceInfo key={place.id} place={place} onPress={(p) => handleSelectedPlace(p)} />
                );
              })}
          </View>
        </ScrollView>
      </BackgroundView>
    </SafeAreaView>
  );
};
export default MapScreen;
