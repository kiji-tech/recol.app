import { Context, Hono } from 'jsr:@hono/hono';
import { getProfile } from './getProfile.ts';

const app = new Hono().basePath('/profile');

app.get('/', getProfile);
Deno.serve(app.fetch);
