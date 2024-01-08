import { RedisOptions } from 'ioredis';

export const redisConfig: Record<
  'production' | 'development' | 'test',
  RedisOptions
> = {
  production: {},
  development: {
    host: 'localhost',
    port: 6379,
  },
  test: {},
};
