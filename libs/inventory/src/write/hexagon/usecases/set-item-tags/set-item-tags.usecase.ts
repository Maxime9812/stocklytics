import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type SetItemTagsUseCasePayload = {
  itemId: string;
  tagIds: string[];
};

export class SetItemTagsUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(payload: SetItemTagsUseCasePayload): Promise<void> {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(payload.itemId);

      item.setTags(payload.tagIds);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
