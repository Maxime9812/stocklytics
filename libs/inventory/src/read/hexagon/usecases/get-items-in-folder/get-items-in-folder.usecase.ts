import { AuthGateway } from '@app/authentication';
import { GetItemsInFolderQuery } from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';

export type GetItemsInFolderUseCasePayload = {
  folderId?: string;
};
export class GetItemsInFolderUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly getItemsInFolderQuery: GetItemsInFolderQuery,
  ) {}

  async execute({ folderId }: GetItemsInFolderUseCasePayload) {
    return this.getItemsInFolderQuery.execute({
      folderId,
      companyId: this.authGateway.currentUser().companyId,
    });
  }
}
