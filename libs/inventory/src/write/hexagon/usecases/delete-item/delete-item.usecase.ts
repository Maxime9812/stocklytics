import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type DeleteItemUseCasePayload = {
  itemId: string;
};
export class DeleteItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId }: DeleteItemUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);

      await this.itemsRepository.delete(item)(trx);
    });
  }
}
