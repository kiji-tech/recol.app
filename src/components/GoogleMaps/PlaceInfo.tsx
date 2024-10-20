'use client';
import React from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import Button from '../Button';
import { reviewAIAnalyze } from '@/src/apis/OpenAI';
import { useState } from 'react';
import IconButton from '../IconButton';
import { usePlan } from '@/src/contexts/PlanContext';
import { Tables } from '@/src/libs/database.types';

type Props = {
  place: any;
  onPress: (place: any) => void;
};
export default function PlaceInfo({ place, onPress }: Props) {
  const { plan, setPlan } = usePlan();
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiText, setIsAiText] = useState('');

  const handleAiAnalyze = async () => {
    setIsAiText('');
    // reviewをまとめる
    const reviews = place.reviews
      .map((review: any) => {
        return `いつ： ${review.publishTime}
評価：${review.rating}

コメント：${review.text.text}
`;
      })
      .join('\n\n');
    setIsAiNavigation(true);
    reviewAIAnalyze(reviews).then((text: string | null) => {
      console.log(text);
      setIsAiText(text || '');
    });
  };

  const handleAddPlan = () => {
    const newPlan = { ...plan, locations: [...plan!.locations!, JSON.stringify(place.location)] };
    setPlan(newPlan as Tables<'plan'>);
  };

  return (
    <TouchableOpacity key={place.id} onPress={() => onPress(place)}>
      <View className={`flex flex-col justify-start items-start w-96`}>
        {/* photos */}
        {/* TODO 画像のスライダー */}
        {/* ない場合は､NotFound image */}
        <Image
          className="w-full h-40 rounded-t-lg"
          src={
            place.photos
              ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
              : ''
          }
        />
        <View
          className={`flex justify-start items-start p-4 rounded-b-lg w-full bg-light-background dark:bg-dark-background`}
        >
          <Text className={`text-2xl font-bold text-light-text dark:text-dark-text`}>
            {place.displayName.text}
          </Text>
          {/* address */}
          <Text className={`text-md text-light-text dark:text-dark-text opacity-80 text-ellipsis`}>
            {place.formattedAddress}
          </Text>
          <View className="mt-4 flex flex-row justify-center items-center gap-2">
            <Button text="AIレビュー" theme="theme" onPress={handleAiAnalyze} />
            <Button text="プランに追加" theme="theme" onPress={handleAddPlan} />
          </View>
          {/* <Text className={`text-md text-light-text dark:text-dark-text`}>{place.phoneNumber}</Text> */}
          {/* rating */}
          {/* <Text>{place.rating}</Text> */}
          {/* GoogleMapURL */}
          {/* <Button text="website" onPress={() => Linking.openURL(place.websiteUri)} /> */}
          {/* reviews */}
        </View>
      </View>
      {isAiNavigation && (
        <Modal animationType="fade" visible={isAiNavigation}>
          <View
            className={`flex-1 justify-center items-center p-8 bg-light-background dark:bg-dark-background`}
          >
            <View className="absolute top-4 left-4">
              <IconButton icon="close" onPress={() => setIsAiNavigation(false)} />
            </View>
            {isAiText ? <Text>{isAiText}</Text> : <Text>AI解析中...</Text>}
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );
}
