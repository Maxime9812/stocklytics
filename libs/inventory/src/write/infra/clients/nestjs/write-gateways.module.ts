import { Module, Scope } from '@nestjs/common';
import { InMemoryAuthGateway } from '@app/inventory/write/infra/gateways/in-memory-auth.gateway';
import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/in-memory-items.repository';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';

@Module({
  imports: [],
  providers: [
    {
      provide: 'AuthGateway',
      useClass: InMemoryAuthGateway,
      scope: Scope.REQUEST,
    },
    {
      provide: 'ItemsRepository',
      useClass: InMemoryItemsRepository,
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
  ],
  exports: ['AuthGateway', 'ItemsRepository', 'DateProvider'],
})
export class WriteGatewaysModule {}
