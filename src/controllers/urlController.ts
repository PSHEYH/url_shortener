import { Request, Response } from 'express';
import Url from '../models/Url';
import { genSalt, hash } from 'bcryptjs';
import { redisClient } from '../utils/redis';

export const urlShorten = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { url, password } = request.body;
  const shortUrl = Math.random().toString(36).substring(2, 8);
  let urlModel;

  if (password !== null) {
    const hashPassword = await hash(password, await genSalt(10));

    urlModel = new Url({
      longUrl: url,
      shortUrl: shortUrl,
      password: hashPassword,
    });
  } else {
    urlModel = new Url({ longUrl: url, shortUrl: shortUrl });
  }

  await urlModel.save();

  await redisClient.hSet(
    shortUrl,
    password === null || password === undefined
      ? { url: url }
      : { url: url, password: urlModel.password! }
  );

  response.json({
    long_url: url,
    short_url: shortUrl,
  });
};

export const createCustomUrl = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { url, password, custom_name: customName } = request.body;
  const shortUrl = `short.ly.${customName}`;
  let urlModel;
  console.log(password);

  if (password !== undefined) {
    const hashPassword = await hash(password, await genSalt(10));
    urlModel = new Url({
      longUrl: url,
      shortUrl: shortUrl,
      password: hashPassword,
    });
  } else {
    urlModel = new Url({ longUrl: url, shortUrl: shortUrl });
  }

  await urlModel.save();
  await redisClient.hSet(
    shortUrl,
    password === null || password === undefined
      ? { url: url }
      : { url: url, password: urlModel.password! }
  );

  response.json({
    long_url: url,
    short_url: shortUrl,
  });
};

export const redirectUrl = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    response.redirect(String(request['url']));
  } catch (error) {
    response.status(500);
  }
};

export const getStats = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { shortUrl } = request.params;
  const result = await redisClient.get(`${shortUrl}:count`);
  if (result == null) {
    response.status(404).json({ message: 'Url not found' });
  } else {
    response.status(200).json({ url: shortUrl, count: parseInt(result) });
  }
};
