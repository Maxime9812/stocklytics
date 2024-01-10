import { Module } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from './knexfile';
import { KnexTransactionPerformer } from '@app/shared/transaction-performing/knex-transacrion-performer';

@Module({
  providers: [
    {
      provide: 'SqlConnection',
      useValue: knex(
        process.env.NODE_ENV == 'production'
          ? knexConfig.production
          : knexConfig.development,
      ),
    },
    {
      provide: 'TransactionPerformer',
      inject: ['SqlConnection'],
      useFactory: (sqlConnection: Knex) =>
        new KnexTransactionPerformer(sqlConnection),
    },
  ],
  exports: ['SqlConnection', 'TransactionPerformer'],
})
export class DatabaseModule {}
