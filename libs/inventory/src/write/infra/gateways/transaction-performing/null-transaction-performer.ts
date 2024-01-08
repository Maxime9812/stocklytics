import {
  GenericTransaction,
  TransactionPerformer,
} from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';

export class NullTransformationPerformer implements TransactionPerformer {
  async perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T> {
    return useCase(null);
  }
}
