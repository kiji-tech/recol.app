import { Tables } from '@/src/libs/database.types';
import { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

export default function TripCalendar({ plan }: Props): ReactNode {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  console.log(plan!.schedule);

  // === Render ===

  if (!plan) return <Text>Plan is not found</Text>;
  return (
    <ScrollView className="w-full h-full flex flex-col gap-10">
      {hours.map((hour) => (
        <View key={hour} className="border-b-2 w-full flex flex-row items-center">
          <Text className="w-1/6 text-center">{hour}</Text>
          <View className="w-5/6 h-16">
            {plan.schedule
              .filter(
                (schedule: Tables<'schedule'>) =>
                  new Date(schedule.from!).getHours() === parseInt(hour)
              )
              .map((s) => (
                <View key={s.uid} className="bg-blue-200 p-2 m-1 rounded">
                  <Text>{s.title}</Text>
                  <Text>{s.description}</Text>
                </View>
              ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
