import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { Either, isLeft, left, right } from 'fp-ts/Either';
import { ItemQuantityCannotBeNegativeError } from '@app/inventory/write/hexagon/models/item';

export type AdjustItemQuantityUseCasePayload = {
  itemId: string;
  quantity: number;
};

export class AdjustItemQuantityUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({
    itemId,
    quantity,
  }: AdjustItemQuantityUseCasePayload): Promise<
    Either<ItemQuantityCannotBeNegativeError, void>
  > {
    return await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(itemId);
      const itemAdjustment = item.adjustQuantity(quantity);
      if (isLeft(itemAdjustment)) {
        return left(itemAdjustment.left);
      }
      await this.itemsRepository.save(item)(trx);
      return right(undefined);
    });
  }
}
