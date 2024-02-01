import { Module } from '@nestjs/common';
import { RealDateProvider } from '@app/inventory/write/hexagon/models/date-provider/real-date.provider';
import { DatabaseModule } from '@app/shared';
import { KnexItemsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-items.repository';
import { Knex } from 'knex';
import { KnexTagsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-tags.repository';
import { KnexFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-folders.repository';
import { KnexGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/knex-get-item-by-id.query';

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
      provide: 'GetItemByIdQuery',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexGetItemByIdQuery(sqlConnection),
    },
  ],
  exports: [
    'ItemsRepository',
    'DateProvider',
    'TagsRepository',
    'FoldersRepository',
    'GetItemByIdQuery',
  ],
})
export class WriteGatewaysModule {}
