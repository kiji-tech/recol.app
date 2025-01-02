import { Button } from '@/src/components';
import { BackgroundView } from '@/src/components';
import DatePicker from '@/src/components/DatePicker';
import { borderColor } from '@/src/themes/ColorUtil';
import dayjs, { Dayjs } from 'dayjs';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import BackButtonHeader from '@/src/components/BackButton';

export default function AddPlan() {
  const [title, setTitle] = useState<string>('');
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());
  const [region, setRegion] = useState<Region>();

  // Location Permissions
  const [status, requestPermission] = Location.useForegroundPermissions();
  if (status == null) {
    requestPermission();
  }

  useEffect(() => {
    const getLocationPermissions = async () => {
      try {
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        console.log({ latitude, longitude });
        setRegion({ latitude, longitude, latitudeDelta: 0.09, longitudeDelta: 0.04 } as Region);
      } catch (e) {
        console.error(e);
      }
    };
    getLocationPermissions();
  }, []);

  /**
   * 登録
   */
  const handlerSubmit = async () => {
    // 登録
    const body = JSON.stringify({
      title,
      from: fromDate.toDate(),
      to: toDate.toDate(),
      locations: [JSON.stringify({ ...region })],
    });
    const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan', {
      body,
      method: 'POST',
    });
    if (res.ok) {
      alert(`${title}`);
      // 一覧に戻る
      router.back();
    } else {
      alert(JSON.stringify(await res.json()));
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <BackgroundView>
          <BackButtonHeader onPress={() => router.back()} isDummy={true}>
            <Text className=" w-full text-3xl ml-4 font-bold text-center">旅行計画の作成</Text>
          </BackButtonHeader>
          {/* タイトル */}
          <View className="w-full flex flex-col justify-start items-start">
            <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
              旅行の題目を入力してください｡
            </Text>
            <TextInput
              placeholder="修学旅行..."
              className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          {/* 日程 */}
          <View className="w-full flex flex-col justify-start items-start">
            <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
              日付を選択してください
            </Text>
            <View className={`flex flex-row justify-center gap-4`}>
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
              友達を追加する
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
              <MapView
                style={{ width: '100%', height: '100%' }}
                region={region}
                provider={PROVIDER_GOOGLE}
                onRegionChangeComplete={(region, { isGesture }) => {
                  if (isGesture) {
                    setRegion(region);
                  }
                }}
              >
                {region && (
                  <Marker
                    coordinate={{ latitude: region?.latitude, longitude: region?.longitude }}
                  ></Marker>
                )}
              </MapView>
              {/* <Map region={region} /> */}
            </View>
          </View>
          <View className="w-full justify-center">
            <Button text="登録する" onPress={() => handlerSubmit()} />
          </View>
        </BackgroundView>
      </ScrollView>
    </SafeAreaView>
  );
}
