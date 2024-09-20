import BackgroundView from '@/src/components/BackgroundView';
import Button from '@/src/components/Button';
import DatePicker from '@/src/components/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeGesture } from 'react-native-swipe-gesture-handler';

const SelectedDates = () => {
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());

  return (
    <SafeAreaView>
      <View className="flex flex-col justify-start items-start">
        <Text className="text-lg text-gray-0 dark:text-gray-100 font-bold">
          日付を選択してください
        </Text>
        <View className="flex flex-row justify-center gap-4">
          <DatePicker label="from" value={fromDate} onChange={(date) => setFromDate(dayjs(date))} />
          <DatePicker label="to" value={toDate} onChange={(date) => setToDate(dayjs(date))} />
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
            <View className="flex flex-row items-end  justify-center">
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
