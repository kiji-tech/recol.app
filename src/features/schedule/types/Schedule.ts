import { Place } from '@/src/features/map/types/Place';
import { Tables } from '@/src/libs/database.types';

export type Schedule = Tables<'schedule'> & { place_list: Place[] };
