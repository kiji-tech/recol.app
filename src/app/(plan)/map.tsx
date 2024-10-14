import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';

import { searchNearby, searchText } from '@/src/apis/GoogleMaps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundView, Button } from '@/src/components';
import BackButtonHeader from '@/src/components/BackButtonHeader';
import Loading from '@/src/components/Loading';
import IconButton from '@/src/components/IconButton';
import { usePlan } from '@/src/contexts/PlanContext';
import IconCheckButton from '@/src/components/IconCheckButton';
import PlaceInfo from '@/src/components/GoogleMaps/PlaceInfo';

// ズームレベルに応じた閾値を決定する関数
const getThresholdDistanceByZoom = (zoom: number): number => {
  // 一般的にズームレベルに応じて距離を調整する
  // ズームが低いほど大きな範囲が表示されるので閾値を大きくする
  if (zoom > 15) {
    return 0.5; // 近距離での閾値 (ズームイン時、500m)
  } else if (zoom > 10) {
    return 2; // 中距離での閾値 (ズーム中、2km)
  } else {
    return 10; // 遠距離での閾値 (ズームアウト時、10km)
  }
};

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
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [places, setPlaces] = useState<any>();
  const isResearched = useMemo(() => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (centerCords.latitude - isCoords.latitude) * (Math.PI / 180);
    const dLon = (centerCords.longitude - isCoords.longitude) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(isCoords.latitude * (Math.PI / 180)) *
        Math.cos(centerCords.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log({
      distance,
      log: Math.log2(360 / isCoords.latitudeDelta),
      flag: distance > getThresholdDistanceByZoom(Math.log2(360 / isCoords.latitudeDelta)),
    });
    return distance > getThresholdDistanceByZoom(Math.log2(360 / isCoords.latitudeDelta)); // 距離をキロメートルで返す
  }, [isCoords, centerCords]);
  const ref = useRef(null);
  const router = useRouter();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // 条件が変わったら再検索
  useEffect(() => {
    if (plan && plan.locations!.length > 0) {
      // 旅行先のロケーションを検索する
      const location = JSON.parse(plan.locations![0]);
      searchNearby(
        location.latitude,
        location.longitude,
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
  }, [plan, isCoffee, isHotel, isPark]);

  const settingPlaces = (places: any) => {
    setPlaces(places);
    setSelectedPlace(places[0]);
  };

  // Location Fetch
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

    const distance = Math.sqrt(
      Math.pow(region.latitude, centerCords.latitude) +
        Math.pow(region.longitude, centerCords.longitude)
    );

  };

  const handleSelectedPlace = (place: any) => {
    setSelectedPlace(place);
    setIsCoords((prev) => {
      return {
        ...prev,
        ...place.location,
      } as Region;
    });
    // refでスクールの位置を変更する
    const index = places.findIndex((p: any) => p.id === place.id);
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
        <View className=" w-full h-80">
          <Map
            places={places}
            selectPlace={(place) => handleSelectedPlace(place)}
            region={isCoords}
            setRegion={handleChangeMap}
          />
        </View>
        {/* 再検索ボタン */}
        <View className="w-full flex flex-row justify-center items-center gap-8">
          <Button text="このエリアで再検索" disabled={!isResearched} onPress={handleResearch} />
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
          <IconButton icon="" onPress={() => alert('coffee')} />
        </View>
        {/* 検索結果一覧 */}
        <ScrollView ref={ref} horizontal={true} bounces={false}>
          <View className={`flex flex-row flex-nowrap gap-8 w-full`}>
            {places &&
              places.map((place: any) => {
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
