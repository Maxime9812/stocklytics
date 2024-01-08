import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';

export type RemoveItemTagUseCasePayload = {
  itemId: string;
  tagId: string;
};

export class RemoveItemTagUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(payload: RemoveItemTagUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(payload.itemId);

      item.removeTag(payload.tagId);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
