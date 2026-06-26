import express from 'express';

import corsMiddleware from '#middleware/cors-middleware';
import errorHandlerMiddleware from '#middleware/error-handler-middleware';
import notFoundMiddleware from '#middleware/not-found-middleware';
import routes from '#routes';

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '256mb' }));

app.use(routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export = app;
