import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import { redisClient } from './utils/redis';

const app = express();
dotenv.config({ path: __dirname + '../.env' });

app.use(express.json());

mongoose.connect('mongodb://mongo:27017/urlshortener');

app.use('/', urlRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res
    .status(500)
    .json({ message: 'Internal server error', error: err.message });
});

const server = app.listen(5001, async () => {
  if (redisClient.isOpen == false) {
    await redisClient.connect();
  }
  console.log(`Listening on port: 5001`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
