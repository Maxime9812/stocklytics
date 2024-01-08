import { Folder } from '@app/inventory/write/hexagon/models/folder';

export interface FoldersRepository {
  save(folder: Folder): Promise<void>;
  folderWithNameInParentFolderExists(
    name: string,
    parentId?: string,
  ): Promise<boolean>;
  getById(id: string): Promise<Folder | undefined>;
}
