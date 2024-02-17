import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { left } from 'fp-ts/Either';

export class DroppingTransactionPerformer implements TransactionPerformer {
  async perform<T>(action: (trx: any) => Promise<T>): Promise<T> {
    // @ts-expect-error - This is a stub
    return left(undefined);
  }
}
