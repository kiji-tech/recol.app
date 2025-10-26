export type ScheduleCategory = {
  label: string;
  value: string;
};

export const ScheduleCategoryList = [
  {
    key: 'movement',
    label: '移動',
    value: 'Movement',
  },
  {
    key: 'meals',
    label: '食事',
    value: 'Meals',
  },
  {
    key: 'cafe',
    label: 'カフェ',
    value: 'Cafe',
  },
  {
    key: 'amusement',
    label: '観光',
    value: 'Amusement',
  },
  {
    key: 'other',
    label: 'その他',
    value: 'Other',
  },
];
