import { Module } from '@nestjs/common';
import { ReadGatewaysModule } from '@app/inventory/read/infra/clients/nestjs/read-gateways.module';
import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';
import { GetItemByIdQuery } from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { AuthGateway } from '@app/authentication';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';

@Module({
  imports: [ReadGatewaysModule, AuthGatewaysModule],
  providers: [
    {
      provide: GetItemByIdUseCase,
      inject: ['GetItemByIdQuery', 'AuthGateway'],
      useFactory: (
        getItemByIdQuery: GetItemByIdQuery,
        authGateway: AuthGateway,
      ) => new GetItemByIdUseCase(getItemByIdQuery, authGateway),
    },
  ],
  exports: [GetItemByIdUseCase],
})
export class ReadUseCasesModule {}
