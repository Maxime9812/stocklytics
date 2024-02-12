import { Barcode } from '@app/inventory/write/hexagon/models/barcode';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type LinkBarcodeToItemUseCasePayload = {
  itemId: string;
  barcode: Barcode;
};

export class LinkBarcodeToItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ itemId, barcode }: LinkBarcodeToItemUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);

      item.linkBarcode(barcode);

      await this.itemsRepository.save(item)(trx);
    });
  }
}
