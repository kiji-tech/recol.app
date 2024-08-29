import Card from "@components/Card";
import React, { useEffect, useState } from "react";
import ViewMap, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import * as Location from "expo-location";

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/src/libs/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

const AppScreen = () => {
  const [isCoords, setIsCoords] = useState<Region>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [state, setState] = useState<any>();
  const [places, setPlaces] = useState<any>();
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }
  const data = [
    { id: "a", location: "location a", memberIds: ["a", "b", "c"] },
    { id: "b", location: "location b", memberIds: ["a", "b", "c"] },
  ];

  const fetchLocation = async (latitude: number, longitude: number) => {
    console.log("fetchLocation", { latitude, longitude });
    const { data, error } = await supabase.functions.invoke(
      "googleMaps/searchNearby",
      {
        body: { latitude, longitude },
      }
    );
    if (error) {
      console.error({ error });
      return;
    }
    setPlaces(data.places);
    setIsLoading(false);
  };

  useEffect(() => {
    const getLocationPermissions = async () => {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      setIsCoords({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      await fetchLocation(latitude, longitude);
    };
    getLocationPermissions();
  }, []);

  if (isLoading) {
    return (
      <View className="flex justify-center items-center h-full">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View className="flex justify-center p-4  mb-2">
        <Text>Header</Text>

        <TextInput
          defaultValue={searchText}
          onChangeText={(n) => setSearchText(n)}
          placeholder="search"
          className="border-2 border-gray-300 rounded-lg p-2 text-[18px] mb-2"
        />

        <FlatList
          data={data.map((d) => ({ key: d.id }))}
          renderItem={({ item }) => (
            <Pressable onPress={() => console.log(item)}>
              <Card>
                <Text>{data.find((v) => v.id == item.key)!.location}</Text>
              </Card>
            </Pressable>
          )}
        />

        <ViewMap
          style={{ height: "75%", width: "100%" }}
          provider={PROVIDER_GOOGLE}
          initialRegion={isCoords}
          region={new AnimatedRegion(isCoords)}
          onRegionChange={(region) => setIsCoords(region)}
        >
          {places?.map((place: any, index: number) => {
            return (
              <Marker
                key={index}
                onPress={() => setSelectedPlace(place)}
                coordinate={{
                  latitude: place.location.latitude,
                  longitude: place.location.longitude,
                }}
              />
            );
          })}
        </ViewMap>
        {selectedPlace && (
          <View className="absolute bottom-10  w-[50%] h-20 bg-white opacity-80 p-4 z-50">
            <Text className="">{selectedPlace.displayName.text}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default AppScreen;
