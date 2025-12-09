import generateI18nMessage from '@/src/libs/i18n';

export type ScheduleCategory = {
  label: string;
  value: string;
};

export const ScheduleCategoryList = [
  {
    key: 'movement',
    label: generateI18nMessage('FEATURE.SCHEDULE.CATEGORY.MOVEMENT'),
    value: 'Movement',
  },
  {
    key: 'meals',
    label: generateI18nMessage('FEATURE.SCHEDULE.CATEGORY.MEALS'),
    value: 'Meals',
  },
  {
    key: 'cafe',
    label: generateI18nMessage('FEATURE.SCHEDULE.CATEGORY.CAFE'),
    value: 'Cafe',
  },
  {
    key: 'amusement',
    label: generateI18nMessage('FEATURE.SCHEDULE.CATEGORY.AMUSEMENT'),
    value: 'Amusement',
  },
  {
    key: 'other',
    label: generateI18nMessage('FEATURE.SCHEDULE.CATEGORY.OTHER'),
    value: 'Other',
  },
];
