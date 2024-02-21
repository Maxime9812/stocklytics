import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';

export type AddImageToItemUseCasePayload = {
  itemId: string;
  imageId: string;
  imagePath: string;
};

export class AddImageToItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly transactionPerformer: TransactionPerformer,
    private readonly imageUploader: ImageUploaderGateway,
  ) {}

  async execute(payload: AddImageToItemUseCasePayload): Promise<void> {
    return this.transactionPerformer.perform(async (trx) => {
      const item = await this.itemsRepository.getById(payload.itemId);

      const imageUrl = await this.imageUploader.uploadImage({
        imageId: payload.imageId,
        imagePath: payload.imagePath,
      });

      item.addImage({ id: payload.imageId, url: imageUrl });

      await this.itemsRepository.save(item)(trx);
    });
  }
}
