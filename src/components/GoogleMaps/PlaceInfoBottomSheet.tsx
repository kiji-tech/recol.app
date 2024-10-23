'use client';
import React from 'react';
import { Image, Modal, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { reviewAIAnalyze } from '@/src/apis/OpenAI';
import { useState } from 'react';
import IconButton from '../IconButton';
import { usePlan } from '@/src/contexts/PlanContext';
import { Tables } from '@/src/libs/database.types';
import { Place } from '@/src/entities/Place';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  places?: Place[];
  onPress: (place: any) => void;
};
export default function PlaceInfoBottomSheet({ places = [], onPress }: Props) {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const { plan, setPlan } = usePlan();
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiText, setIsAiText] = useState('');
  const sheetRef = React.useRef(null);

  const handleAiAnalyze = async (place: Place) => {
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

  const handleAddPlan = async (place: Place) => {
    const newPlan = { ...plan, place_id_list: [place.id] };
    const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlan),
    });

    if (res.ok) {
      setPlan(newPlan as Tables<'plan'>);
    } else {
      alert(JSON.stringify(await res.json()));
    }
  };

  return (
    <>
      <BottomSheet ref={sheetRef} index={1} snapPoints={['25%', '75%', '25%']} bottomInset={120}>
        <BottomSheetView>
          <View>
            <Text className="text-3xl font-bold text-light-text">検索結果</Text>
          </View>
        </BottomSheetView>
        <BottomSheetScrollView
          bounces={true}
          contentContainerStyle={{ paddingBottom: bottomSafeArea }}
          contentContainerClassName="bg-light-background dark:bg-dark-background"
        >
          {places.map((place) => (
            <View
              key={place.id}
              className="flex flex-row p-4 w-screen border-b-[1px] border-b-light-border  dark:border-b-dark-border"
            >
              <View className="w-1/4 flex-1 justify-center items-center">
                <Image
                  className={`w-full h-24 rounded-lg`}
                  src={
                    place.photos
                      ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
                      : ''
                  }
                />
              </View>
              <View
                className={`flex justify-start items-start w-3/4 pl-4 bg-light-background dark:bg-dark-background`}
              >
                <Text className={`text-2xl font-bold text-light-text dark:text-dark-text`}>
                  {place.displayName.text}
                </Text>
                {/* address */}
                <Text
                  className={`text-md text-light-text dark:text-dark-text opacity-80 text-ellipsis`}
                >
                  {place.formattedAddress}
                </Text>
                <View className="w-full flex flex-row justify-end items-end gap-8 pt-2">
                  <TouchableOpacity onPress={() => handleAiAnalyze(place)}>
                    <FontAwesome5 name="robot" size={32} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddPlan(place)}>
                    <MaterialIcons name="check-box-outline-blank" size={32} color="black" />
                  </TouchableOpacity>
                  {/* <Button
                      text="AIレビュー"
                      theme="theme"
                      onPress={() => handleAiAnalyze(place)}
                      />
                      <Button
                      text="プランに追加"
                      theme="theme"
                      onPress={() => handleAddPlan(place)}
                      /> */}
                </View>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      {isAiNavigation && (
        <Modal animationType="fade" visible={isAiNavigation}>
          <View
            className={`flex-1 justify-center items-center p-8 bg-light-background dark:bg-dark-background`}
          >
            <View className="absolute top-10 left-4">
              <IconButton icon="close" onPress={() => setIsAiNavigation(false)} />
            </View>
            {isAiText ? <Text>{isAiText}</Text> : <Text>AI解析中...</Text>}
          </View>
        </Modal>
      )}
    </>
  );
}
