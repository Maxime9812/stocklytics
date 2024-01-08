import {
  GenericTransaction,
  TransactionPerformer,
} from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';
import { Knex } from 'knex';

export class KnexTransactionPerformer implements TransactionPerformer {
  private sqlConnection: Knex;

  constructor(sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T> {
    return this.sqlConnection.transaction<T>(async (trx) => {
      let result;
      try {
        result = await useCase(trx);
        await trx.commit();
      } catch (e) {
        await trx.rollback(e);
      }
      return result;
    });
  }
}
