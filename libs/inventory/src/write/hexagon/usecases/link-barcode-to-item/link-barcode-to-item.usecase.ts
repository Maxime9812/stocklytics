import { Barcode } from '@app/inventory/write/hexagon/models/barcode';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { Either, left, right } from 'fp-ts/Either';
import { AuthGateway } from '@app/authentication';

export class BarcodeAlreadyLinkedToAnotherItemError {
  type = 'BarcodeAlreadyLinkedToAnotherItemError';
  constructor(readonly itemId: string) {}
}

type LinkBarcodeToItemUseCaseError = BarcodeAlreadyLinkedToAnotherItemError;

export type LinkBarcodeToItemUseCasePayload = {
  itemId: string;
  barcode: Barcode;
};

export class LinkBarcodeToItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
    private readonly authGateway: AuthGateway,
  ) {}

  async execute({
    itemId,
    barcode,
  }: LinkBarcodeToItemUseCasePayload): Promise<
    Either<LinkBarcodeToItemUseCaseError, void>
  > {
    return await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);
      const user = this.authGateway.currentUser();

      const itemAlreadyLinkedToBarcodeId =
        await this.itemsRepository.getItemIdByBarcode(barcode, user.companyId);

      if (itemAlreadyLinkedToBarcodeId) {
        return left(
          new BarcodeAlreadyLinkedToAnotherItemError(
            itemAlreadyLinkedToBarcodeId,
          ),
        );
      }

      item.linkBarcode(barcode);

      await this.itemsRepository.save(item)(trx);
      return right(undefined);
    });
  }
}
