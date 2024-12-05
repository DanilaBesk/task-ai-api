import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { ErrorMiddleware, RouteNotFoundMiddleware } from '#/middlewares';
import { router } from '#/routes';
import { start } from '#/start';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

app.all('*', RouteNotFoundMiddleware);

app.use(ErrorMiddleware);

start(app);
