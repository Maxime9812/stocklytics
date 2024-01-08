import {
  Folder,
  FolderSnapshot,
} from '@app/inventory/write/hexagon/models/folder';

export const folderBuilder = (
  snapshot: FolderSnapshot = {
    id: '680fde0a-2ac6-47d4-a400-54a8da963083',
    name: 'folder-name',
    companyId: '1c7bbeee-8f25-43da-93db-e1f025645257',
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
