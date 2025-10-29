import { Hono } from 'jsr:@hono/hono';
import { getProfile } from './fetchProfile.ts';
import { createProfileHandler } from './createProfile.ts';
import { updateProfile } from './updateProfile.ts';
import { syncPremiumPlan } from './syncPremiumPlan.ts';

const app = new Hono().basePath('/profile');

app.get('/', getProfile);
app.post('/', createProfileHandler);
app.put('/', updateProfile);
app.put('/sync-premium-plan', syncPremiumPlan);

Deno.serve(app.fetch);
