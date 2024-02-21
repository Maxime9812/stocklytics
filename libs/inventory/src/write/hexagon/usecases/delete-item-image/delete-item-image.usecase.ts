import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';

export type DeleteItemImageUseCasePayload = {
  itemId: string;
};

export class DeleteItemImageUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
    private readonly imageUploaderGateway: ImageUploaderGateway,
  ) {}

  async execute(payload: DeleteItemImageUseCasePayload): Promise<void> {
    await this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(payload.itemId);

      await this.imageUploaderGateway.deleteImage(item.image.id);

      item.deleteImage();

      await this.itemsRepository.save(item)(trx);
    });
  }
}
