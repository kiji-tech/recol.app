import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
    <View className="flex flex-col justify-start max-w-40 w-[40%] ">
      {/* <TextInput
        className="disabled"
        value={value.format('YYYY/MM/DD')}
        onPress={showDatePicker}
        readOnly
      /> */}
      {label && (
        <Text className="border-bottom-[1px] border-gray-10 text-lg text-gray-10 dark:text-gray-100">
          {label}
        </Text>
      )}
      <TouchableOpacity onPress={showDatePicker}>
        <Text className="text-sm text-gray-10 dark:text-gray-100 bg-gray-100 dark:bg-gray-0 border-gray-50 dark:border-gray-70 border-[1px] py-2 px-4 rounded-lg shadow-md">
          {value.format('YYYY-MM-DD')}
        </Text>
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
