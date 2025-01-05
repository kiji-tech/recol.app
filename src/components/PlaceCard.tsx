import { View, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Place, Review } from '../entities/Place';
import { reviewAIAnalyze } from '../apis/OpenAI';
import { useState } from 'react';
import AIAnalyzeModal from './Modal/AIAnalyzeModal';
import RateViewer from './RateViewer';

type Props = {
  place: Place | null;
};
export default function PlaceCard({ place }: Props) {
  // ==== Member ====
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiText, setIsAiText] = useState('');

  // ==== Method ====
  const handleAiAnalyze = async () => {
    if (!place) return;
    setIsAiText('');
    // reviewをまとめる
    if (!place.reviews) {
      alert('レビューがありません');
      return;
    }
    const reviews = place.reviews
      .map((review: Review) => {
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

  //   const handleAddPlan = async (place: Place) => {
  //     const newPlan = { ...plan, place_id_list: [place.id] };
  //     const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newPlan),
  //     });

  //     if (res.ok) {
  //       setPlan(newPlan as Tables<'plan'>);
  //     } else {
  //       alert(JSON.stringify(await res.json()));
  //     }
  //   };

  // ==== Render ====
  if (!place) return null;

  return (
    <View>
      <View className="absolute bottom-24 w-full">
        <View className="w-4/5 mx-auto  rounded-xl bg-light-background dark:bg-dark-background">
          {/* イメージ画像 */}
          <Image
            className={`w-full h-32 rounded-t-xl`}
            src={
              place.photos
                ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
                : ''
            }
          />
          {/* body */}
          <View className="flex flex-col gap-2 p-2">
            {/* /title */}
            <Text className="text-lg font-bold">{place.displayName.text}</Text>
            {/* rate */}
            <RateViewer rating={place.rating} />
            {/* description */}
            {/* TODO maxの指定 */}
            <Text>{place.editorialSummary?.text || ''}</Text>
            {/* button group */}
            <View className="flex flex-row justify-start items-center gap-4">
              <TouchableOpacity
                className="p-2 w-32 bg-light-theme dark:bg-dark-theme rounded-3xl"
                onPress={() => {
                  Linking.openURL(place.websiteUri);
                }}
              >
                <Text className="text-sm text-center font-semibold">ウェブサイト</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 w-32 bg-light-theme dark:bg-dark-theme rounded-3xl"
                onPress={() => handleAiAnalyze()}
              >
                <Text className="text-sm text-center font-semibold">AI要約</Text>
              </TouchableOpacity>
              <CheckBox title="" checked={false} onPress={() => {}} />
            </View>
          </View>
        </View>
      </View>

      {isAiNavigation && (
        <AIAnalyzeModal
          open={isAiNavigation}
          onClose={() => setIsAiNavigation(false)}
          text={isAiText}
        />
      )}
    </View>
  );
}
