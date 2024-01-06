import {
  Folder,
  FolderSnapshot,
} from '@app/inventory/write/hexagon/models/folder';

export const folderBuilder = (
  snapshot: FolderSnapshot = {
    id: 'folder-id',
    name: 'folder-name',
    companyId: 'company-id',
    parentId: undefined,
    createdAt: new Date('2024-01-01'),
  },
) => {
  return {
    withId: (id: string) => folderBuilder({ ...snapshot, id }),
    withName: (name: string) => folderBuilder({ ...snapshot, name }),
    createdAt: (createdAt: Date) => folderBuilder({ ...snapshot, createdAt }),
    withCompanyId: (companyId: string) =>
      folderBuilder({ ...snapshot, companyId }),
    withParentId: (parentId: string) =>
      folderBuilder({ ...snapshot, parentId }),
    build: () => Folder.fromSnapshot(snapshot),
  };
};
