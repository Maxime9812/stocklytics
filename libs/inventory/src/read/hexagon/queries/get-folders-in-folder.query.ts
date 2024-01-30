export type GetFoldersInFolderResponse = {
  id: string;
  name: string;
  parentId: string | null;
  itemQuantity: number;
  createdAt: Date;
}[];

export type GetFoldersInFolderPayload = {
  folderId?: string;
  companyId: string;
};

export interface GetFoldersInFolderQuery {
  execute(
    payload: GetFoldersInFolderPayload,
  ): Promise<GetFoldersInFolderResponse>;
}
