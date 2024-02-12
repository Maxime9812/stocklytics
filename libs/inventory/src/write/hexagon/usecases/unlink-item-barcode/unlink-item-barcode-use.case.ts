import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export class UnLinkItemBarcodeUseCasePayload {
  itemId: string;
}

export class UnlinkItemBarcodeUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId }: UnLinkItemBarcodeUseCasePayload): Promise<void> {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);

      item.unlinkBarcode();

      await this.itemsRepository.save(item)(trx);
    });
  }
}
