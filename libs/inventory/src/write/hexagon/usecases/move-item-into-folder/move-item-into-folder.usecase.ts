import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';

export type MoveItemIntoFolderUseCasePayload = {
  itemId: string;
  folderId: string;
};

export class MoveItemIntoFolderUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly foldersRepository: FoldersRepository,
  ) {}

  async execute({ itemId, folderId }: MoveItemIntoFolderUseCasePayload) {
    const item = await this.itemsRepository.getById(itemId);
    const folder = await this.foldersRepository.getById(folderId);

    item.moveIntoFolder(folder);

    await this.itemsRepository.save(item);
  }
}
