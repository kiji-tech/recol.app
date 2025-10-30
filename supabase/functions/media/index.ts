import { Hono } from 'jsr:@hono/hono';
import { createMedia } from './createMedia.ts';
import { withUser } from '../libs/authenticate/withUser.ts';
import { listMedia } from './fetchMedia.ts';
import { deleteMedia } from './deleteMedia.ts';
const app = new Hono().basePath('/media');

app.post('/list', (c) => withUser(c, listMedia));
app.post('/', (c) => withUser(c, createMedia));
app.post('/delete', (c) => withUser(c, deleteMedia));
Deno.serve(app.fetch);
