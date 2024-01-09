import { Module } from '@nestjs/common';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { RegisterUserUseCase } from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { UsersRepository } from '@app/authentication/hexagon/gateways/users.repository';
import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';
import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';

@Module({
  imports: [AuthGatewaysModule],
  providers: [
    {
      provide: RegisterUserUseCase,
      inject: [
        'UsersRepository',
        'DateProvider',
        'PasswordHasher',
        'UuidGenerator',
      ],
      useFactory: (
        usersRepository: UsersRepository,
        dateProvider: DateProvider,
        passwordHasher: PasswordHasher,
        uuidGenerator: UuidGenerator,
      ) =>
        new RegisterUserUseCase(
          usersRepository,
          dateProvider,
          passwordHasher,
          uuidGenerator,
        ),
    },
  ],
  exports: [RegisterUserUseCase],
})
export class AuthUseCasesModule {}
