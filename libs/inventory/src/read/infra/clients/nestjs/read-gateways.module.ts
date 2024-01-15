import { Module } from '@nestjs/common';
import { KnexGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/knex-get-item-by-id.query';
import { Knex } from 'knex';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'GetItemByIdQuery',
      inject: ['SqlConnection'],
      useFactory: (knex: Knex) => new KnexGetItemByIdQuery(knex),
    },
  ],
  exports: ['GetItemByIdQuery'],
})
export class ReadGatewaysModule {}
