import {
  FolderExistParams,
  FoldersRepository,
} from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';
import {
  Folder,
  FolderSnapshot,
} from '@app/inventory/write/hexagon/models/folder';

export class InMemoryFoldersRepository implements FoldersRepository {
  private _folders: Map<string, FolderSnapshot> = new Map();
  async save(folder: Folder): Promise<void> {
    this._folders.set(folder.id, folder.snapshot);
  }

  async folderWithNameInParentFolderExists(
    params: FolderExistParams,
  ): Promise<boolean> {
    const { name, parentId, companyId } = params;
    return [...this._folders.values()].some(
      (folder) =>
        folder.name === name &&
        folder.parentId === parentId &&
        folder.companyId === companyId,
    );
  }

  async getById(id: string): Promise<Folder | undefined> {
    return this._folders.has(id)
      ? Folder.fromSnapshot(this._folders.get(id))
      : undefined;
  }

  get folders() {
    return [...this._folders.values()].map((folder) =>
      Folder.fromSnapshot(folder),
    );
  }

  givenFolders(...folders: Folder[]) {
    folders.forEach((folder) => this._folders.set(folder.id, folder.snapshot));
  }

  async delete(folder: Folder): Promise<void> {
    this._folders.delete(folder.id);
  }
}
