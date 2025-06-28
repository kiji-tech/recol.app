import { Tables } from '@/src/libs/database.types';
import { Place } from './Place';

export type Schedule = Tables<'schedule'> & { place_list: Place[] };
export type Plan = Tables<'plan'> & { schedule: Schedule[] };
