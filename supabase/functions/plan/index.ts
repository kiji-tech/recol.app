import { Hono } from 'jsr:@hono/hono';
import { createPlan } from './createPlan.ts';
import { updatePlan } from './updatePlan.ts';
import { get, list } from './fetchPlan.ts';
import { deletePlan } from './deletePlan.ts';
import { withUser } from '../libs/authenticate/withUser.ts';

const app = new Hono().basePath('/plan');

app.get('/:uid', (c) => withUser(c, get));
app.post('/list', (c) => withUser(c, list));
app.post('/', (c) => withUser(c, createPlan));
app.put('/', (c) => withUser(c, updatePlan));
app.post('/delete', (c) => withUser(c, deletePlan));
Deno.serve(app.fetch);
