import { Tables } from '@/src/libs/database.types';
import { Schedule } from '@/src/features/schedule/types/Schedule';

export type Plan = Tables<'plan'> & { schedule: Schedule[] };
