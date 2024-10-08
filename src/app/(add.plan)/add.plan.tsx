import { Button } from '@/src/components';
import { BackgroundView } from '@/src/components';
import CancelButton from '@/src/components/CancelButton';
import DatePicker from '@/src/components/DatePicker';
import Map from '@/src/components/GoogleMaps/Map';
import { bgFormColor, borderColor, textColor } from '@/src/themes/ColorUtil';
import dayjs, { Dayjs } from 'dayjs';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Region } from 'react-native-maps';

export default function AddPlan() {
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());
  const [locations, setLocations] = useState<string[]>([]);

  const [locationPermission, setLocationPermission] = useState(false);
  const [region, setRegion] = useState<Region>();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  useEffect(() => {
    const getLocationPermissions = async () => {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      console.log({ latitude, longitude });
      setRegion({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } as Region);
    };
    getLocationPermissions();
  }, []);

  const handlerSubmit = async () => {
    // 登録
    const body = JSON.stringify({ from: fromDate.toDate(), to: toDate.toDate(), locations });
    const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/list', {
      body,
      method: 'POST',
    }).then((res) => res.json());
    // toast
    // 一覧に戻る
    router.back();
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        {/* タイトル */}
        <View className="w-full flex flex-col justify-start items-start">
          <Text className={`text-lg font-bold ${textColor}`}>旅行の題目を入力してください｡</Text>
          <TextInput
            placeholder="修学旅行..."
            className={`flex flex-row justify-center rounded-xl items-center border px-4 pt-2 pb-4 w-full text-xl
                ${borderColor} ${textColor} ${bgFormColor}
            `}
          />
        </View>
        {/* 日程 */}
        <View className="w-full flex flex-col justify-start items-start">
          <Text className={`text-lg font-bold ${textColor}`}>日付を選択してください</Text>
          <View className="flex flex-row justify-center gap-4">
            <DatePicker
              label="from"
              value={fromDate}
              onChange={(date) => setFromDate(dayjs(date))}
            />
            <DatePicker label="to" value={toDate} onChange={(date) => setToDate(dayjs(date))} />
          </View>
        </View>
        <View>
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            友達を追加する (任意)
          </Text>
          <Button text="選択" onPress={() => alert('準備中')} />
        </View>
        {/* 場所 */}
        <View className="w-full">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text">
            旅行したい場所を教えて下さい｡
          </Text>
          <View className="w-full h-[320px] rounded-xl">
            {/* TODO: Pinどめして､ロケーションを保存する */}
            <Map region={region} />
          </View>
        </View>
        <View className="flex flex-row items-center w-full justify-center gap-4 mt-8">
          <CancelButton />
          <Button text="登録する" onPress={() => handlerSubmit()} />
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}
