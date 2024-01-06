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

  async execute(payload: AddTagToItemUseCasePayload) {}
}
