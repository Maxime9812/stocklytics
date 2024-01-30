import {
  GetFoldersInFolderPayload,
  GetFoldersInFolderQuery,
  GetFoldersInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';

export class StubGetFoldersInFoldersQuery implements GetFoldersInFolderQuery {
  private _foldersInFolder: Map<string, GetFoldersInFolderResponse> = new Map();

  async execute(
    payload: GetFoldersInFolderPayload,
  ): Promise<GetFoldersInFolderResponse> {
    return this._foldersInFolder.get(this.getKeyFromPayload(payload)) ?? [];
  }

  givenFoldersInFolder(
    payload: GetFoldersInFolderPayload,
    folders: GetFoldersInFolderResponse,
  ) {
    this._foldersInFolder.set(this.getKeyFromPayload(payload), folders);
  }

  private getKeyFromPayload(payload: GetFoldersInFolderPayload) {
    return `${payload.folderId}-${payload.companyId}`;
  }
}
