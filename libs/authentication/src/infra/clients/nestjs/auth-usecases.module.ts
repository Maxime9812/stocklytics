import { Module } from '@nestjs/common';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { RegisterUserUseCase } from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { UsersRepository } from '@app/authentication/hexagon/gateways/repositories/users.repository';
import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';
import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';
import { AuthGateway } from '@app/authentication';
import { LoginUseCase } from '@app/authentication/hexagon/usecases/login/login.usecase';
import { LogoutUseCase } from '@app/authentication/hexagon/usecases/logout/logout.usecase';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { CompaniesRepository } from '@app/authentication/hexagon/gateways/repositories/companies.repository';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [AuthGatewaysModule, DatabaseModule],
  providers: [
    {
      provide: RegisterUserUseCase,
      inject: [
        'UsersRepository',
        'DateProvider',
        'PasswordHasher',
        'UuidGenerator',
        'AuthGateway',
        'CompaniesRepository',
        'TransactionPerformer',
      ],
      useFactory: (
        usersRepository: UsersRepository,
        dateProvider: DateProvider,
        passwordHasher: PasswordHasher,
        uuidGenerator: UuidGenerator,
        authGateway: AuthGateway,
        companiesRepository: CompaniesRepository,
        transactionPerformer: TransactionPerformer,
      ) =>
        new RegisterUserUseCase(
          usersRepository,
          dateProvider,
          passwordHasher,
          uuidGenerator,
          authGateway,
          companiesRepository,
          transactionPerformer,
        ),
    },

    {
      provide: LoginUseCase,
      inject: ['UsersRepository', 'PasswordHasher', 'AuthGateway'],
      useFactory: (
        usersRepository: UsersRepository,
        passwordHasher: PasswordHasher,
        authGateway: AuthGateway,
      ) => new LoginUseCase(usersRepository, authGateway, passwordHasher),
    },

    {
      provide: LogoutUseCase,
      inject: ['AuthGateway'],
      useFactory: (authGateway: AuthGateway) => new LogoutUseCase(authGateway),
    },
  ],
  exports: [RegisterUserUseCase, LoginUseCase, LogoutUseCase],
})
export class AuthUseCasesModule {}
