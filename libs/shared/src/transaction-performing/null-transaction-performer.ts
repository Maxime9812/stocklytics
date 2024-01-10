import {
  GenericTransaction,
  TransactionPerformer,
} from '@app/shared/transaction-performing/transaction-performer';

export class NullTransformationPerformer implements TransactionPerformer {
  async perform<T>(
    useCase: (trx: GenericTransaction) => Promise<T>,
  ): Promise<T> {
    return useCase(null);
  }
}
