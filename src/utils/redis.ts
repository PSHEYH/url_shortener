import * as redis from 'redis';

export let redisClient = redis.createClient({ url: 'redis://redis:6379' });
