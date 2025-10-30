import { Hono } from 'jsr:@hono/hono';
import { getProfile } from './fetchProfile.ts';
import { createProfileHandler } from './createProfile.ts';
import { updateProfile } from './updateProfile.ts';
import { syncPremiumPlan } from './syncPremiumPlan.ts';
import { withUser } from '../libs/authenticate/withUser.ts';
const app = new Hono().basePath('/profile');

app.get('/', (c) => withUser(c, getProfile));
app.post('/', (c) => withUser(c, createProfileHandler));
app.put('/', (c) => withUser(c, updateProfile));
app.put('/sync-premium-plan', (c) => withUser(c, syncPremiumPlan));

Deno.serve(app.fetch);
