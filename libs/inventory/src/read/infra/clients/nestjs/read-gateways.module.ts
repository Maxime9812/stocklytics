import { Module } from '@nestjs/common';
import { KnexGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/knex-get-item-by-id.query';
import { Knex } from 'knex';
import { DatabaseModule } from '@app/shared';
import { KnexGetItemsInFolderQuery } from '@app/inventory/read/infra/queries/get-items-in-folder/knex-get-items-in-folder.query';
import { KnexGetFoldersInFolderQuery } from '@app/inventory/read/infra/queries/get-folders-in-folder/knex-get-folders-in-folder.query';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'GetItemByIdQuery',
      inject: ['SqlConnection'],
      useFactory: (knex: Knex) => new KnexGetItemByIdQuery(knex),
    },
    {
      provide: 'GetFoldersInFolderQuery',
      inject: ['SqlConnection'],
      useFactory: (knex: Knex) => new KnexGetFoldersInFolderQuery(knex),
    },
    {
      provide: 'GetItemsInFolderQuery',
      inject: ['SqlConnection'],
      useFactory: (knex: Knex) => new KnexGetItemsInFolderQuery(knex),
    },
  ],
  exports: [
    'GetItemByIdQuery',
    'GetFoldersInFolderQuery',
    'GetItemsInFolderQuery',
  ],
})
export class ReadGatewaysModule {}
