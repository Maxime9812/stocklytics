import { Module } from '@nestjs/common';
import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/in-memory-items.repository';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';

@Module({
  imports: [],
  providers: [
    {
      provide: 'ItemsRepository',
      useClass: InMemoryItemsRepository,
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
  ],
  exports: ['ItemsRepository', 'DateProvider'],
})
export class WriteGatewaysModule {}
