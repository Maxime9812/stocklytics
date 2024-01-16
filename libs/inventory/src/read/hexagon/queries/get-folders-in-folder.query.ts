export type GetFoldersInFolderResponse = {
  id: string;
  name: string;
};

export type GetFoldersInFolderPayload = {
  folderId: string;
  companyId: string;
};

export interface GetFoldersInFolderQuery {
  execute(
    payload: GetFoldersInFolderPayload,
  ): Promise<GetFoldersInFolderResponse | undefined>;
}
