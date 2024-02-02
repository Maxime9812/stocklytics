import {
  GetFolderByIdQuery,
  GetFolderByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-folder-by-id.query';

export class StubGetFolderById implements GetFolderByIdQuery {
  private readonly folders: Map<string, GetFolderByIdResponse> = new Map();
  async execute(id: string): Promise<GetFolderByIdResponse | undefined> {
    return this.folders.get(id);
  }

  givenFolder(folder: GetFolderByIdResponse) {
    this.folders.set(folder.id, folder);
  }
}
