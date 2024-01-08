import { FoldersRepository } from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';
import { AuthGateway } from '@app/authentication';
import { DateProvider } from '@app/inventory/write/hexagon/models/date-provider/date.provider';
import { Folder } from '@app/inventory/write/hexagon/models/folder';

export type CreateNewFolderUseCasePayload = {
  id: string;
  name: string;
  parentId?: string;
};

export class CreateNewFolderUseCase {
  constructor(
    private readonly foldersRepository: FoldersRepository,
    private readonly authGateway: AuthGateway,
    private readonly dateProvider: DateProvider,
  ) {}
  async execute({ id, name, parentId }: CreateNewFolderUseCasePayload) {
    const folderWithSameNameInParentFolderExists =
      await this.foldersRepository.folderWithNameInParentFolderExists({
        name,
        parentId,
        companyId: this.authGateway.getCompanyId(),
      });

    if (folderWithSameNameInParentFolderExists) return;

    const folder = Folder.create({
      id,
      name,
      parentId,
      companyId: this.authGateway.getCompanyId(),
      currentDate: this.dateProvider.getNow(),
    });

    await this.foldersRepository.save(folder);
  }
}
