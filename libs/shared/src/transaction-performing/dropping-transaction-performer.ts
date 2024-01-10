import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export class DroppingTransactionPerformer implements TransactionPerformer {
  async perform<T>(action: (trx: any) => Promise<T>): Promise<T> {
    return;
  }
}
