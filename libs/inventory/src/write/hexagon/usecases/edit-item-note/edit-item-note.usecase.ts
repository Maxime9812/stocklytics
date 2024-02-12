import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type EditItemNoteUseCasePayload = {
  itemId: string;
  note: string;
};
export class EditItemNoteUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId, note }: EditItemNoteUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);

      item.editNote(note);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
