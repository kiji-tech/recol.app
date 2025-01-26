import dayjs from '@/src/libs/dayjs';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {
  label?: string;
  value: Dayjs;
  mode?: 'date' | 'time';
  onChange: (date: Dayjs) => void;
};
const DatePicker = ({ label, mode = 'date', value, onChange }: Props) => {
  const format = mode === 'date' ? 'YYYY-MM-DD' : 'HH:mm';
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(dayjs(date));
    hideDatePicker();
  };

  return (
    <View className={`flex flex-col justify-start max-w-40 w-[40%]`}>
      {label && <Text className={`text-light-text dark:text-dark-text`}>{label}</Text>}
      <TouchableOpacity onPress={showDatePicker}>
        <View
          className={`border py-4 px-4 rounded-xl bg-light-background dark:bg-dark-background `}
        >
          <Text className={`text-md text-light-text dark:text-dark-text`}>
            {value.format(format)}
          </Text>
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        locale={'ja'}
        date={value.toDate()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePicker;
