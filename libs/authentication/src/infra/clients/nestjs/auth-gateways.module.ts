import { Module, Scope } from '@nestjs/common';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';

@Module({
  providers: [
    {
      provide: 'AuthGateway',
      useClass: InMemoryAuthGateway,
      scope: Scope.REQUEST,
    },
  ],
  exports: ['AuthGateway'],
})
export class AuthGatewaysModule {}
