import { Hono } from 'jsr:@hono/hono';
import { withUser } from '../libs/authenticate/withUser.ts';
import { deleteUserAccount } from './deleteAccount.ts';

const app = new Hono().basePath('/delete-account');

app.delete('/', (c) => withUser(c, deleteUserAccount));

export default app;
