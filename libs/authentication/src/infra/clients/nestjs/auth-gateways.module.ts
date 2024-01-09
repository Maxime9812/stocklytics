import { Module, Scope } from '@nestjs/common';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';
import { RealDateProvider } from '@app/authentication/hexagon/models/date-provider/real-date.provider';
import { CryptoUuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/crypto-uuid-generator';
import { BcryptPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/bcrypt-password-hasher';

@Module({
  providers: [
    {
      provide: 'AuthGateway',
      useClass: InMemoryAuthGateway,
      scope: Scope.REQUEST,
    },
    {
      provide: 'UsersRepository',
      useClass: InMemoryUsersRepository,
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
