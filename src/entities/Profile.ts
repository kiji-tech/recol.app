import { Tables } from '../libs/database.types';

export type Profile = (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null;
