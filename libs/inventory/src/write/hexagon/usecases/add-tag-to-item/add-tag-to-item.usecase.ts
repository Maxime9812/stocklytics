import { TagsRepository } from '@app/inventory/write/hexagon/gateways/repositories/tags.repository';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type AddTagToItemUseCasePayload = {
  itemId: string;
  tagId: string;
};

export class AddTagToItemUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(payload: AddTagToItemUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(payload.itemId);
      const tag = await this.tagsRepository.getById(payload.tagId);

      item.addTag(tag);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
