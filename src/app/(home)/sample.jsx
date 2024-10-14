import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import Map from '@components/GoogleMaps/Map';

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSearch = async () => {
    try {
      const result = await Location.geocodeAsync(searchQuery);
      if (result.length > 0) {
        const newPlace = {
          id: Date.now().toString(),
          name: searchQuery,
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        };
        setPlaces([...places, newPlace]);
        setSearchQuery('');
        mapRef.current.animateToRegion({
          latitude: newPlace.latitude,
          longitude: newPlace.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error searching for place:', error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const addPlaceToSchedule = (placeId) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [dateString]: [...(prevSchedule[dateString] || []), placeId],
    }));
  };

  const renderPlace = ({ item }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() => addPlaceToSchedule(item.id)}
    >
      <Text className="text-base text-gray-800">{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSchedule = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const scheduledPlaces = schedule[dateString] || [];

    if (scheduledPlaces.length === 0) {
      return <Text className="text-gray-600">この日付にスケジュールされた場所はありません。</Text>;
    }

    return (
      <FlatList
        data={scheduledPlaces.map((id) => places.find((place) => place.id === id))}
        renderItem={({ item }) => <Text className="text-base text-gray-800 py-2">{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const renderWeekView = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <View className="flex-row justify-between mb-4">
        {DAYS_OF_WEEK.map((day, index) => {
          const date = new Date(currentDate);
          date.setDate(date.getDate() + index);
          const isSelected = date.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={index}
              className={`items-center justify-center w-10 h-10 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => handleDateSelect(date)}
            >
              <Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {day}
              </Text>
              <Text className={`text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <View className="w-full h-80">
        <Map
          region={{
            latitude: 35.6762,
            longitude: 139.6503,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
      <View className="p-4">
        <View className="flex-row mb-4">
          <TextInput
            className="flex-1 h-12 px-4 mr-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="場所を検索"
            accessibilityLabel="場所を検索"
          />
          <TouchableOpacity
            className="bg-blue-500 px-6 rounded-lg items-center justify-center"
            onPress={handleSearch}
          >
            <Text className="text-white font-semibold">追加</Text>
          </TouchableOpacity>
        </View>
        {renderWeekView()}
        <View className="mt-4">
          <Text className="text-xl font-bold mb-2">
            スケジュール:{' '}
            {selectedDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          {renderSchedule()}
        </View>
      </View>
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id}
        className="border-t border-gray-200"
      />
    </ScrollView>
  );
}
