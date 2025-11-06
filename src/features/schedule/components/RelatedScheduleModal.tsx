import { DatePicker, ModalLayout } from '@/src/components';
import React from 'react';
import { Schedule } from '../types/Schedule';
import { Button, View } from 'react-native';
import { Text } from 'react-native';
import dayjs from '@/src/libs/dayjs';
import Title from '@/src/components/Title';
import { ScrollView } from 'react-native-gesture-handler';
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00.000Z';

const RelatedScheduleItem = ({ item, orgSchedule }: { item: Schedule; orgSchedule?: Schedule }) => {
  if (item.uid == orgSchedule?.uid) {
    return (
      <View className="bg-light-background dark:bg-dark-background p-4 rounded-lg">
        <Text className="text-lg font-bold text-light-text dark:text-dark-text">★{item.title}</Text>
        {/* FromとToの変更がわかるように表示する */}
        <Text>
          From: {dayjs(orgSchedule.from).format('YYYY-MM-DD HH:mm')} →
          {dayjs(item.from).format('HH:mm')}
        </Text>
        <Text>
          To: {dayjs(orgSchedule.to).format('YYYY-MM-DD HH:mm')} → {dayjs(item.to).format('HH:mm')}
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col justify-start items-start">
      <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>日時</Text>
      <View className={`flex flex-row justify-center items-center gap-4`}>
        <DatePicker
          mode="datetime"
          value={item.from ? dayjs(item.from) : dayjs()}
          onChange={(date) => {
            item = {
              ...item,
              from: date.format(DATE_FORMAT),
              to: dayjs(date).add(1, 'hour').format(DATE_FORMAT),
            };
          }}
        />
        <Text className="text-light-text dark:text-dark-text"> ― </Text>
        <DatePicker
          mode="datetime"
          value={item.to ? dayjs(item.to) : dayjs(item.from).add(1, 'hour')}
          onChange={(date) =>
            (item = {
              ...item,
              to: date.format(DATE_FORMAT),
            })
          }
        />
      </View>
    </View>
  );
};

type Props = {
  orgSchedule?: Schedule;
  relatedScheduleList?: Schedule[];
  isOpen: boolean;
  onSubmit: (list: Schedule[]) => void;
  onClose: () => void;
};

export default function RelatedScheduleModal({
  orgSchedule,
  relatedScheduleList = [],
  isOpen = false,
  onSubmit = () => void 0,
  onClose,
}: Props) {
  if (!orgSchedule || !relatedScheduleList.length) return;
  return (
    <ModalLayout visible={isOpen} size="full" onClose={onClose}>
      <View>
        <Title text="関連スケジュールの変更を一緒にしますか？" />
        <ScrollView>
          {relatedScheduleList.map((item) => (
            <RelatedScheduleItem key={item.uid} item={item} orgSchedule={orgSchedule} />
          ))}
        </ScrollView>
        <Button title="保存" onPress={() => onSubmit(relatedScheduleList || [])} />
      </View>
    </ModalLayout>
  );
}
