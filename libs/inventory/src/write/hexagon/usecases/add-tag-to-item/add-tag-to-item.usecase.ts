import { TagsRepository } from '@app/inventory/write/hexagon/gateways/tags.repository';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/items.repository';

export type AddTagToItemUseCasePayload = {
  itemId: string;
  tagId: string;
};

export class AddTagToItemUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async execute(payload: AddTagToItemUseCasePayload) {
    const item = await this.itemsRepository.getById(payload.itemId);
    const tag = await this.tagsRepository.getById(payload.tagId);

    item.addTag(tag);

    await this.itemsRepository.save(item);
  }
}
