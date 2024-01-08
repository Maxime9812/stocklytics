import { Folder } from '@app/inventory/write/hexagon/models/folder';

export type FolderExistParams = {
  name: string;
  parentId?: string;
  companyId: string;
};

export interface FoldersRepository {
  save(folder: Folder): Promise<void>;
  folderWithNameInParentFolderExists(
    params: FolderExistParams,
  ): Promise<boolean>;
  getById(id: string): Promise<Folder | undefined>;
}
