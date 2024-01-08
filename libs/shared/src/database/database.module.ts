import { Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from './knexfile';

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
  ],
  exports: ['SqlConnection'],
})
export class DatabaseModule {}
