import { Module } from '@nestjs/common';
import { InMemoryItemsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-items.repository';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';
import { InMemoryFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-folders.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: 'ItemsRepository',
      useClass: InMemoryItemsRepository,
    },
    {
      provide: 'TagsRepository',
      useClass: InMemoryItemsRepository,
    },
    {
      provide: 'FoldersRepository',
      useClass: InMemoryFoldersRepository,
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
  ],
  exports: [
    'ItemsRepository',
    'DateProvider',
    'TagsRepository',
    'FoldersRepository',
  ],
})
export class WriteGatewaysModule {}
