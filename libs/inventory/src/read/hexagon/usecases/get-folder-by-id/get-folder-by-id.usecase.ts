import {
  GetFolderByIdQuery,
  GetFolderByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-folder-by-id.query';
import { AuthGateway } from '@app/authentication';

export class GetFolderByIdUseCase {
  constructor(
    private readonly getFolderByIdQuery: GetFolderByIdQuery,
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(id: string): Promise<GetFolderByIdResponse | undefined> {
    const folder = await this.getFolderByIdQuery.execute(id);
    if (!folder) {
      return;
    }
    const authUser = this.authGateway.currentUser();
    if (folder.companyId !== authUser.companyId) {
      return;
    }
    return folder;
  }
}
