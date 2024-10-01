import Map from '@components/GoogleMaps/Map';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

import { searchNearby, searchText } from '@/src/apis/GoogleMaps';
import Button from '@/src/components/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Image, Linking, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tables } from '@/src/libs/database.types';

const AppScreen = () => {
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<Tables<'plan'>>();
  const [isCoords, setIsCoords] = useState<Region>();
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [places, setPlaces] = useState<any>();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

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
          console.log({ plana: plan.data[0] });
          setPlan(plan.data[0]);
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setIsLoading(false);
        });
    })();
  }, []);

  useEffect(() => {
    if (plan && plan.locations!.length > 0) {
      setText(plan.locations![0]);
      searchText(isCoords?.latitude || 0, isCoords?.longitude || 0, plan.locations![0]).then(
        (response) => {
          console.log({ response });
          settingPlaces(response);
        }
      );
    }
  }, [plan]);

  const settingPlaces = (places: any) => {
    console.log({ places });
    setPlaces(places);
    setSelectedPlace(places[0]);
    setIsCoords({
      ...places[0].location,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
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

  // Location Fetch
  const fetchLocation = async (latitude: number, longitude: number) => {
    console.log('fetchLocation', { latitude, longitude });
    const response = await searchNearby(latitude, longitude);
    settingPlaces(response);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View className="flex justify-center items-center h-full">
        <Text className="mb-2">{isLoading ? 'Loading...' : ''}</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View className="flex justify-start items-center h-full">
        {/* マップオブジェクト */}
        <View className="w-[100%] h-[100%] rounded-md">
          <Map
            places={places}
            selectPlace={(place) => setSelectedPlace(place)}
            region={isCoords}
            setRegion={(region) => setIsCoords(region)}
          />
        </View>
        {/* 検索バー */}
        <View className="absolute bg-gray-100 flex flex-row justify-between rounded-xl items-center w-[95%] top-5">
          <MaterialIcons className="absolute opacity-30" name="search" size={38} color="#25292e" />
          <TextInput
            defaultValue={text}
            onChangeText={(n) => setText(n)}
            placeholder="検索"
            onBlur={() => handleSearch()}
            returnKeyType="search"
            className="border-2 border-gray-300 w-full rounded-xl text-[18px] pl-12 py-2"
          />
        </View>

        {/* 選択した場所のカード */}
        {selectedPlace && (
          <View className="w-[70%] absolute bottom-5 bg-white opacity-80">
            {/* photos */}
            <View className="flex flex-row justify-start items-center">
              <Image
                className="max-h-full h-[100%] w-1/3 bg-gray-300"
                src={selectedPlace.photos[0].authorAttributions[0].photoUri}
              />

              <View className="flex justify-start items-start w-2/3">
                <Text className="text-mb">{selectedPlace.displayName.text}</Text>
                {/* address */}
                <Text className="text-xs">{selectedPlace.formattedAddress}</Text>
                {/* rating */}
                <Text>{selectedPlace.rating}</Text>
                {/* GoogleMapURL */}
                <Button text="website" onPress={() => Linking.openURL(selectedPlace.websiteUri)} />
              </View>
            </View>
            {/* reviews */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default AppScreen;
