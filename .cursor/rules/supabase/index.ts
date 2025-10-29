import { Context, Hono } from 'jsr:@hono/hono';
import { fetchProfile } from './fetchProfile.ts';

const app = new Hono().basePath('/profile');

app.get('/', fetchProfile);
Deno.serve(app.fetch);
