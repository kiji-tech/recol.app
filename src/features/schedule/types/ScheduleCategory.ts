import i18n from '@/src/libs/i18n';

export type ScheduleCategory = {
  label: string;
  value: string;
};

export const ScheduleCategoryList = [
  {
    key: 'movement',
    label: i18n.t('SCREEN.SCHEDULE.CATEGORY.MOVEMENT'),
    value: 'Movement',
  },
  {
    key: 'meals',
    label: i18n.t('SCREEN.SCHEDULE.CATEGORY.MEALS'),
    value: 'Meals',
  },
  {
    key: 'cafe',
    label: i18n.t('SCREEN.SCHEDULE.CATEGORY.CAFE'),
    value: 'Cafe',
  },
  {
    key: 'amusement',
    label: i18n.t('SCREEN.SCHEDULE.CATEGORY.AMUSEMENT'),
    value: 'Amusement',
  },
  {
    key: 'other',
    label: i18n.t('SCREEN.SCHEDULE.CATEGORY.OTHER'),
    value: 'Other',
  },
];
