import { Module, Scope } from '@nestjs/common';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import { RealDateProvider } from '@app/authentication/hexagon/models/date-provider/real-date.provider';
import { CryptoUuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/crypto-uuid-generator';
import { BcryptPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/bcrypt-password-hasher';
import { DatabaseModule } from '@app/shared';
import { KnexUsersRepository } from '@app/authentication/infra/gateways/repositories/knex/knex-users.repository';
import { Knex } from 'knex';
import { RedisStoreAuthGateway } from '@app/authentication/infra/gateways/redis-store-auth.gateway';
import { REQUEST } from '@nestjs/core';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'AuthGateway',
      inject: [REQUEST],
      useFactory: (request: Request) => new RedisStoreAuthGateway(request),
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
  ],
})
export class AuthGatewaysModule {}
