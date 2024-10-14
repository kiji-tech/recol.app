import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  backgroundColor,
  bgFormColor,
  borderColor,
  shadowColor,
  textColor,
} from '../themes/ColorUtil';

type Props = {
  label?: string;
  value: Dayjs;
  onChange: (date: Date) => void;
};
const DatePicker = ({ label, value, onChange }: Props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn('A date has been picked: ', date);
    onChange(date);
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
            {value.format('YYYY-MM-DD')}
          </Text>
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePicker;
