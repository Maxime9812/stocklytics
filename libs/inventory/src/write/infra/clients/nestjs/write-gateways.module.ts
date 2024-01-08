import { Module } from '@nestjs/common';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';
import { DatabaseModule } from '@app/shared';
import { KnexItemsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-items.repository';
import { Knex } from 'knex';
import { KnexTagsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-tags.repository';
import { KnexFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-folders.repository';
import { KnexTransactionPerformer } from '@app/inventory/write/infra/gateways/transaction-performing/knex-transacrion-performer';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'ItemsRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexItemsRepository(sqlConnection),
    },
    {
      provide: 'TagsRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexTagsRepository(sqlConnection),
    },
    {
      provide: 'FoldersRepository',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexFoldersRepository(sqlConnection),
    },
    {
      provide: 'DateProvider',
      useClass: RealDateProvider,
    },
    {
      provide: 'TransactionPerformer',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexTransactionPerformer(sqlConnection),
    },
  ],
  exports: [
    'ItemsRepository',
    'DateProvider',
    'TagsRepository',
    'FoldersRepository',
    'TransactionPerformer',
  ],
})
export class WriteGatewaysModule {}
