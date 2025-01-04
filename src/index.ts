import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import { ErrorMiddleware, RouteNotFoundMiddleware } from '#/middlewares';
import { router } from '#/routes';
import { start } from '#/start';
import { specs } from '#/docs';
import { CONFIG } from '#config';

export const app = express();

app.use(
  cors({
    origin: CONFIG.CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.all('*', RouteNotFoundMiddleware);

app.use(ErrorMiddleware);

start(app);
