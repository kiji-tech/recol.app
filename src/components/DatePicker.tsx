import dayjs, { Dayjs } from 'dayjs';
import { View } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';

type Props = {
  selectedDates: { from?: Dayjs; to?: Dayjs };
  onChange: (dates: { from?: Dayjs; to?: Dayjs }) => void;
};
const DatePicker = ({ selectedDates, onChange }: Props) => {
  return (
    <View className="bg-light-100 dark:bg-dark-200">
      <DateTimePicker
        locale={'jp'}
        mode="range"
        initialView="month"
        startDate={selectedDates.from}
        endDate={selectedDates.to}
        onChange={({ startDate, endDate }) => {
          if (startDate && endDate) {
            onChange({ from: dayjs(startDate), to: dayjs(endDate) });
          } else if (startDate) {
            onChange({ from: dayjs(startDate), to: undefined });
          } else if (endDate) {
            onChange({ from: undefined, to: dayjs(endDate) });
          }
        }}
      />
    </View>
  );
};

export default DatePicker;
