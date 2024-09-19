import Button from '@/src/components/Button';
import DatePicker from '@/src/components/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeGesture } from 'react-native-swipe-gesture-handler';

const SelectedDates = () => {
  const [date, setDate] = useState<{ from?: Dayjs; to?: Dayjs }>({
    from: undefined,
    to: undefined,
  });

  return (
    <SafeAreaView>
      <View className="mb-2">
        <Text className="text-lg text-gray-900 dark:text-gray-100 font-bold">日付を選択してください</Text>
      </View>
      <DatePicker selectedDates={date} onChange={setDate} />
    </SafeAreaView>
  );
};

const NextScreen = () => {
  return (
    <SafeAreaView>
      <View className="w-100 h-10 bg-light-400 dark:bg-dark-300 ">
        <Text className="text-gray-900 dark:text-gray-100">Next</Text>
      </View>
    </SafeAreaView>
  );
};

export default function AddPlan() {
  const steps = [
    { label: 'selected date', component: () => <SelectedDates /> },
    { label: 'selected achieve', component: () => <NextScreen /> },
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
      <SwipeGesture onSwipePerformed={handleSwipe}>
        <View className="flex justify-end items-center flex-col bg-light-400 dark:bg-dark-400 h-full w-full">
          <View className="flex h-full w-full">{steps[activeStep].component()}</View>
          <View className="flex flex-row items-end  justify-center">
            {steps.map((step, index) => (
              <TouchableOpacity key={step.label} onPress={() => setActiveStep(index)}>
                <View
                  className={`w-6 h-6 mx-4 rounded-xl bottom-4  bg-gray-100 border-[1px] ${activeStep == index && 'bg-light-100 dark:bg-dark-100'}`}
                ></View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SwipeGesture>
    </SafeAreaView>
  );
}
