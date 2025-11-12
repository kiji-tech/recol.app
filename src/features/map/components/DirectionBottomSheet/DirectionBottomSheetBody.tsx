import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import { Step } from '../../types/Direction';
import Loading from '@/src/components/Loading';
type Props = {
  selectedPlace: Place;
  stepList: Step[];
  selectedStepIndex?: number | null;
  isLoading?: boolean;
  onStepSelect?: (index: number) => void;
};

/**
 * 距離テキストを整形
 * @param distance {number} 距離(メートル)
 * @return {string} 整形後の距離テキスト
 */
const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distance)} m`;
};

/**
 * 所要時間テキストを整形
 * @param duration {number} 時間(秒)
 * @return {string} 整形後の時間テキスト
 */
const formatDuration = (duration: number): string => {
  if (duration <= 0) return '0 分';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.round((duration % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} 時間 ${minutes} 分` : `${hours} 時間`;
  }
  return `${minutes} 分`;
};

/**
 * HTMLタグを除去した指示文を返却
 * @param instruction {string} HTML形式の指示文
 * @return {string} HTMLタグ除去後のテキスト
 */
const sanitizeInstruction = (instruction: string): string => {
  return instruction
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

export default function DirectionBottomSheetBody({
  selectedPlace,
  stepList,
  selectedStepIndex = null,
  isLoading = false,
  onStepSelect = () => void 0,
}: Props) {
  const totalDistance = useMemo(() => {
    return stepList.reduce((sum, step) => sum + (step.distance?.value || 0), 0);
  }, [stepList]);
  const totalDuration = useMemo(() => {
    return stepList.reduce((sum, step) => sum + (step.duration?.value || 0), 0);
  }, [stepList]);
  const totalDistanceText = useMemo(() => formatDistance(totalDistance), [totalDistance]);
  const totalDurationText = useMemo(() => formatDuration(totalDuration), [totalDuration]);

  return (
    <View className="w-full flex-1 px-4 pb-6">
      <Text className="text-xl font-semibold text-light-text dark:text-dark-text">
        {selectedPlace.displayName.text}
      </Text>
      <View className="flex flex-row items-center justify-between mt-4 mb-6 rounded-lg bg-light-backgroundSecondary dark:bg-dark-backgroundSecondary px-4 py-3">
        <View className="flex flex-col">
          <Text className="text-xs text-light-text dark:text-dark-text">合計距離</Text>
          <Text className="text-base font-semibold text-light-text dark:text-dark-text">
            {totalDistanceText}
          </Text>
        </View>
        <View className="h-8 w-[1px] bg-light-border dark:bg-dark-border" />
        <View className="flex flex-col items-end">
          <Text className="text-xs text-light-text dark:text-dark-text">所要時間</Text>
          <Text className="text-base font-semibold text-light-text dark:text-dark-text">
            {totalDurationText}
          </Text>
        </View>
      </View>
      <BottomSheetScrollView className="w-full flex-1">
        {isLoading && (
          <View className="flex items-center justify-center py-8">
            <Loading />
          </View>
        )}
        {!isLoading && stepList.length === 0 && (
          <Text className="text-center text-light-text dark:text-dark-text">
            経路情報がありません｡
          </Text>
        )}
        {!isLoading &&
          stepList.map((step, index) => {
            const instruction = sanitizeInstruction(step.html_instructions);
            const isSelected = selectedStepIndex === index;
            return (
              <TouchableOpacity
                key={`${step.start_location.lat}-${step.start_location.lng}-${index}`}
                onPress={() => onStepSelect(index)}
                className={`mb-4 rounded-lg border p-4 ${
                  isSelected
                    ? 'border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10'
                    : 'border-light-border dark:border-dark-border'
                }`}
              >
                <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  {instruction.length > 0 ? instruction : '経路情報なし'}
                </Text>
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-xs text-gray-500 dark:text-gray-300">
                    {step.distance?.text || formatDistance(step.distance?.value || 0)}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-300">
                    {step.duration?.text || formatDuration(step.duration?.value || 0)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </BottomSheetScrollView>
    </View>
  );
}
