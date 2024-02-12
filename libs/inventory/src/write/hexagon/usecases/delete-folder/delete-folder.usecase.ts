import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';

export type DeleteFolderUseCasePayload = {
  folderId: string;
};

export class DeleteFolderUseCase {
  constructor(private readonly foldersRepository: FoldersRepository) {}

  async execute({ folderId }: DeleteFolderUseCasePayload): Promise<void> {
    const folder = await this.foldersRepository.getById(folderId);

    await this.foldersRepository.delete(folder);
  }
}
