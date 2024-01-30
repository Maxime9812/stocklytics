import { AuthGateway } from '@app/authentication';
import { GetFoldersInFolderQuery } from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';

export type GetFoldersInFoldersUseCasePayload = {
  folderId?: string;
};

export class GetFoldersInFoldersUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly getFoldersInFolderQuery: GetFoldersInFolderQuery,
  ) {}
  async execute({ folderId }: GetFoldersInFoldersUseCasePayload) {
    return this.getFoldersInFolderQuery.execute({
      companyId: this.authGateway.currentUser().companyId,
      folderId,
    });
  }
}
