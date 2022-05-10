import express from 'express';
import apiRouter from './api/router';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(apiRouter);

// eslint-disable-next-line no-unused-vars
const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
);
