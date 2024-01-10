import { Module, Scope } from '@nestjs/common';
import { RealDateProvider } from '@app/authentication/hexagon/models/date-provider/real-date.provider';
import { CryptoUuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/crypto-uuid-generator';
import { BcryptPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/bcrypt-password-hasher';
import { DatabaseModule } from '@app/shared';
import { KnexUsersRepository } from '@app/authentication/infra/gateways/repositories/knex/knex-users.repository';
import { Knex } from 'knex';
import { RequestSessionAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/request-session-auth.gateway';
import { REQUEST } from '@nestjs/core';
import { default as Redis } from 'ioredis/built/Redis';
import { redisConfig } from '@app/authentication/infra/redis-config/redis.config';
import RedisStore from 'connect-redis';
import { Store } from 'express-session';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'SessionStore',
      useFactory: () => {
        const redisClient = new Redis(
          process.env.NODE_ENV == 'production'
            ? redisConfig.production
            : redisConfig.development,
        );
        return new (RedisStore as any)({ client: redisClient });
      },
    },
    {
      provide: 'AuthGateway',
      inject: [REQUEST, 'SessionStore'],
      useFactory: (request: Request, store: Store) =>
        new RequestSessionAuthGateway(request, store),
      scope: Scope.REQUEST,
    },
    {
      provide: 'UsersRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexUsersRepository(sqlConnection),
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
    {
      provide: 'UuidGenerator',
      useClass: CryptoUuidGenerator,
    },
  ],
  exports: [
    'AuthGateway',
    'UsersRepository',
    'DateProvider',
    'PasswordHasher',
    'UuidGenerator',
    'SessionStore',
  ],
})
export class AuthGatewaysModule {}
