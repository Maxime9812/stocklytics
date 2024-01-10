import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type MoveItemIntoFolderUseCasePayload = {
  itemId: string;
  folderId?: string;
};

export class MoveItemIntoFolderUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly foldersRepository: FoldersRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId, folderId }: MoveItemIntoFolderUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);

      item.moveIntoFolder(folderId);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
