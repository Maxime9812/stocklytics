import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';

export type RemoveItemTagUseCasePayload = {
  itemId: string;
  tagId: string;
};

export class RemoveItemTagUseCase {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  async execute(payload: RemoveItemTagUseCasePayload) {
    const item = await this.itemsRepository.getById(payload.itemId);

    item.removeTag(payload.tagId);

    await this.itemsRepository.save(item);
  }
}
