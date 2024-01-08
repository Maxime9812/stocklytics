import { TransactionPerformer } from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';

export class DroppingTransactionPerformer implements TransactionPerformer {
  async perform<T>(action: (trx: any) => Promise<T>): Promise<T> {
    return;
  }
}
