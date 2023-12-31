import { Module, Scope } from '@nestjs/common';
import { AuthController } from '@app/authentication/infra/clients/nestjs/controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@app/inventory/write/infra/clients/nestjs/guards/auth.guard';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';

@Module({
  imports: [AuthGatewaysModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      inject: ['AuthGateway'],
      useFactory: (authGateway: AuthGateway) => new AuthGuard(authGateway),
      scope: Scope.REQUEST,
    },
  ],
})
export class AuthModule {}
