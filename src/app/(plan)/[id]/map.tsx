import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

import { searchNearby, searchText } from '@/src/apis/GoogleMaps';
import Button from '@/src/components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tables } from '@/src/libs/database.types';
import { BackgroundView } from '@/src/components';
import {
  backgroundColor,
  bgFormColor,
  borderColor,
  shadowColor,
  textColor,
} from '@/src/themes/ColorUtil';
import BackButtonHeader from '@/src/components/BackButtonHeader';
import Loading from '@/src/components/Loading';
import IconButton from '@/src/components/IconButton';

const AppScreen = () => {
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<Tables<'plan'>>();
  const [isCoords, setIsCoords] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [places, setPlaces] = useState<any>();

  const router = useRouter();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  // Planを取得する
  useEffect(() => {
    (async () => {
      fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          const plan = await res.json();
          setPlan(plan.data);
        })
        .catch((e) => console.error(e));
    })();
  }, []);

  // Planが取得できたら､初期表示の場所を取得する
  useEffect(() => {
    if (plan && plan.locations!.length > 0) {
      setText(plan.locations![0]);
      searchText(0, 0, '熱海 カフェ')
        .then((response) => {
          settingPlaces(response);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [plan]);

  useEffect(() => {
    if (!selectedPlace) return;
    setIsCoords((prev) => {
      return {
        ...prev,
        latitude: selectedPlace.location.latitude,
        longitude: selectedPlace.location.longitude,
      } as Region;
    });
  }, [selectedPlace]);

  const settingPlaces = (places: any) => {
    setPlaces(places);
    setSelectedPlace(places[0]);
    setIsCoords((prev) => {
      return {
        ...prev,
        latitude: places[0].location.latitude,
        longitude: places[0].location.longitude,
      } as Region;
    });
  };

  const handleSearch = async () => {
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

  const handleChangeMap = async (region: Region) => {
    console.log({ region });
    setIsCoords(region);

    setIsLoading(true);
    try {
      await fetchLocation(region.latitude, region.longitude);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Location Fetch
  const fetchLocation = async (latitude: number, longitude: number) => {
    const response = await searchNearby(latitude, longitude, true, false);
    settingPlaces(response);
    setSelectedPlace(response[0]);
  };

  const handleSelectedPlace = (place: any) => {
    setSelectedPlace(place);
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
                border px-4 py-2 ml-4 
                ${bgFormColor}  ${borderColor}`}
          >
            <MaterialIcons className={`opacity-30 `} name="search" size={24} color="#25292e" />
            <TextInput
              defaultValue={text}
              onChangeText={(n) => setText(n)}
              placeholder="検索"
              onBlur={() => handleSearch()}
              returnKeyType="search"
              className={`w-full rounded-xl text-md pl-2 ${textColor}`}
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
        <View className="w-full flex flex-row justify-center items-center gap-8 ">
          {/* TODO ボタン群 */}
          <IconButton icon="coffee" onPress={() => alert('coffee')} />
          <IconButton icon="hotel" onPress={() => alert('coffee')} />
          <IconButton icon="park" onPress={() => alert('coffee')} />
          <IconButton icon="" onPress={() => alert('coffee')} />
        </View>
        {/* 検索結果一覧 */}
        <ScrollView horizontal={true} bounces={false}>
          <View className={`flex flex-row flex-nowrap gap-8 w-full`}>
            {places &&
              places.map((place: any) => {
                return (
                  <TouchableOpacity key={place.placeId} onPress={() => setSelectedPlace(place)}>
                    <View
                      className={`flex flex-col justify-start items-start w-80
                        rounded-lg
                        ${backgroundColor} ${borderColor}
                        border rounded-md`}
                    >
                      {/* photos */}
                      {/* TODO 画像のスライダー */}
                      {/* ない場合は､NotFound image */}
                      <Image
                        className="w-full h-40 rounded-t-lg"
                        src={place.photos ? place.photos[0].authorAttributions[0].photoUri : ''}
                      />

                      <View
                        className={`flex justify-start items-start p-4 h-92  ${backgroundColor}`}
                      >
                        <Text className={`text-2xl font-bold ${textColor}`}>
                          {place.displayName.text}
                        </Text>
                        {/* address */}
                        <Text className={`text-md ${textColor} opacity-80 text-ellipsis`}>
                          {place.formattedAddress}
                        </Text>
                        {/* <Text className={`text-md ${textColor}`}>{place.phoneNumber}</Text> */}
                        {/* rating */}
                        {/* <Text>{place.rating}</Text> */}
                        {/* GoogleMapURL */}
                        {/* <Button text="website" onPress={() => Linking.openURL(place.websiteUri)} /> */}
                        {/* reviews */}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </BackgroundView>
    </SafeAreaView>
  );
};
export default AppScreen;
