export type GetItemsInFolderResponse = {
  id: string;
  name: string;
  quantity: number;
}[];

export type GetItemsInFolderPayload = {
  folderId: string;
  companyId: string;
};
export interface GetItemsInFolderQuery {
  execute(
    payload: GetItemsInFolderPayload,
  ): Promise<GetItemsInFolderResponse | undefined>;
}
