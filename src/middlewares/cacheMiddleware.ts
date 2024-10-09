import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../utils/redis';
import { compare } from 'bcryptjs';

export const cacheMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { shortUrl } = request.params;
  const { password } = request.query;

  try {
    const result = await redisClient.hGetAll(shortUrl);
    console.log(result);
    if (result.url !== null) {
      if (result.password === undefined) {
        redisClient.incr(`${shortUrl}:count`);
        request['url'] = result.url;
        return next();
      } else {
        if (password == undefined) {
          response.status(401).json({ message: 'Password is required' });
          return;
        }
        if ((await compare(String(password!), result.password)) == false) {
          response.status(401).json({
            message: 'Wrong password',
          });
        } else {
          request['url'] = result.url;
          return next();
        }
      }
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
