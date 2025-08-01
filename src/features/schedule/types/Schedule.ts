import { Place } from '@/src/entities/Place';
import { Tables } from '@/src/libs/database.types';

export type Schedule = Tables<'schedule'> & { place_list: Place[] };