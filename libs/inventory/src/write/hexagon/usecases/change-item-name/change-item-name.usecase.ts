import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type ChangeItemNameUseCasePayload = {
  itemId: string;
  name: string;
};

export class ChangeItemNameUseCase {
  constructor(
    private readonly itemRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId }: ChangeItemNameUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemRepository.getById(itemId);

      item.changeName('new name');

      await this.itemRepository.save(item)(trx);
    });
  }
}
