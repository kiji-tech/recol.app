import { Button } from '@/src/components';
import BackgroundView from '@/src/components/BackgroundView';
import CancelButton from '@/src/components/CancelButton';
import DatePicker from '@/src/components/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeGesture } from 'react-native-swipe-gesture-handler';

const SelectedDates = () => {
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());
  const [locations, setLocations] = useState<string[]>([]);

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
      <View className="flex flex-col justify-start items-start gap-4 h-screen">
        <Text className="text-lg text-gray-0 dark:text-gray-100 font-bold">
          日付を選択してください
        </Text>
        <View className="flex flex-row justify-center gap-4">
          <DatePicker label="from" value={fromDate} onChange={(date) => setFromDate(dayjs(date))} />
          <DatePicker label="to" value={toDate} onChange={(date) => setToDate(dayjs(date))} />
        </View>
        <Text className="text-lg text-gray-0 dark:text-gray-100 font-bold">
          旅行したい場所を教えて下さい｡
        </Text>
        <TextInput
          className="w-full h-10 p-2 border border-gray-50 dark:border-gray-70 rounded-lg bg-gray-100 dark:bg-dark-primary-base dark:text-gray-100 shadow-md"
          value={locations[0]}
          placeholder={'場所を入力してください'}
          keyboardType="default"
          onChangeText={(text) => setLocations([text])}
        />
        <Text className="text-lg text-gray-0 dark:text-gray-100 font-bold">
          友達を追加する (任意)
        </Text>
        <Button text="選択" onPress={() => alert('準備中')} />
        <View className="flex flex-row w-full justify-center items-center gap-4 absolute bottom-[20px] h-full">
          <CancelButton />
          <Button text="登録する" onPress={() => handlerSubmit()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const ColorPicker = () => {
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full justify-around gap-2">
        <View className="flex flex-row justify-center items-start flex-wrap gap-2">
          <View className="w-10 h-10 rounded-full bg-light-primary-base dark:bg-dark-primary-base" />
          <View className="w-10 h-10 rounded-full bg-light-primary-hover dark:bg-dark-primary-hover" />
          <View className="w-10 h-10 rounded-full bg-light-primary-disabled dark:bg-dark-primary-disabled" />
          <View className="w-10 h-10 rounded-full bg-light-primary-clear dark:bg-dark-primary-clear" />
        </View>
        <View className="flex flex-row justify-center items-start flex-wrap gap-2">
          <View className="w-10 h-10 rounded-full  bg-light-secondary-base dark:bg-dark-secondary-base" />
          <View className="w-10 h-10 rounded-full  bg-light-secondary-hover dark:bg-dark-secondary-hover" />
          <View className="w-10 h-10 rounded-full  bg-light-secondary-disabled dark:bg-dark-secondary-disabled" />
          <View className="w-10 h-10 rounded-full  bg-light-secondary-clear dark:bg-dark-secondary-clear" />
        </View>
        <View className="flex flex-row justify-center items-start flex-wrap gap-2">
          <View className="w-10 h-10 rounded-full bg-light-info-base dark:bg-dark-info-base" />
          <View className="w-10 h-10 rounded-full bg-light-info-hover dark:bg-dark-info-hover" />
          <View className="w-10 h-10 rounded-full bg-light-info-disabled dark:bgdark-info-disabled" />
          <View className="w-10 h-10 rounded-full bg-light-info-clear dark:bg-dark-info-clear" />
        </View>
        <View className="flex flex-row justify-center items-start flex-wrap gap-2">
          <View className="w-10 h-10 rounded-full bg-light-warn-base dark:bg-dark-warn-base" />
          <View className="w-10 h-10 rounded-full bg-light-warn-hover dark:bg-dark-warn-hover" />
          <View className="w-10 h-10 rounded-full bg-light-warn-disabled dark:bg-dark-warn-disabled" />
          <View className="w-10 h-10 rounded-full bg-light-warn-clear dark:bg-dark-warn-clear" />
        </View>
        <View className="flex flex-row justify-center items-start flex-wrap gap-2">
          <View className="w-10 h-10 rounded-full bg-light-danger-base dark:bg-dark-danger-base" />
          <View className="w-10 h-10 rounded-full bg-light-danger-hover dark:bg-dark-danger-hover" />
          <View className="w-10 h-10 rounded-full bg-light-danger-disabled dark:bg-dark-danger-disabled" />
          <View className="w-10 h-10 rounded-full bg-light-danger-clear dark:bg-dark-danger-clear" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function AddPlan() {
  const steps = [
    { label: 'selected date', component: () => <SelectedDates /> },
    { label: 'selected achieve', component: () => <ColorPicker /> },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const handleSwipe = (action: string) => {
    if (action === 'left') {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else if (action === 'right') {
      setActiveStep((prev) => Math.max(prev - 1, 0));
    }
  };
  return (
    <SafeAreaView>
      <BackgroundView>
        <SwipeGesture onSwipePerformed={handleSwipe}>
          <View className="flex justify-end items-center flex-col">
            <View className="flex h-full w-full">{steps[activeStep].component()}</View>
            <View className="flex flex-row items-end justify-center">
              {steps.map((step, index) => (
                <TouchableOpacity key={step.label} onPress={() => setActiveStep(index)}>
                  <View
                    className={`w-6 h-6 mx-4 rounded-xl bottom-4  bg-gray-100 border-[1px] ${activeStep == index && 'bg-light-secondary-clear dark:bg-dark-secondary-clear'}`}
                  ></View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SwipeGesture>
      </BackgroundView>
    </SafeAreaView>
  );
}
