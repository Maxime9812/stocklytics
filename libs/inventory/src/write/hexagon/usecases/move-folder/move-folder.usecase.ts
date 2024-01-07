import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';

export type MoveFolderUseCasePayload = {
  folderId: string;
  parentFolderId?: string;
};

export class MoveFolderUseCase {
  constructor(private readonly folderRepository: FoldersRepository) {}

  async execute(payload: MoveFolderUseCasePayload) {
    const folder = await this.folderRepository.getById(payload.folderId);

    folder.moveToFolder(payload.parentFolderId);

    await this.folderRepository.save(folder);
  }
}
