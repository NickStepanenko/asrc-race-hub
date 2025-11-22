import next from 'next';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './auth/router';
import compression from 'compression';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  app.use(compression());
  app.use(cors({ origin: process.env.WEB_ORIGIN, credentials: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use('/api/auth', express.json(), authRouter); // your API
  app.use((req, res) => handle(req, res)); // Next handles everything else
  app.listen(process.env.PORT ?? 3000);
});
