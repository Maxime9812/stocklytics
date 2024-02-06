export type GetItemsInFolderResponse = {
  id: string;
  name: string;
  folderId?: string;
  createdAt: Date;
  note: string;
  quantity: number;
}[];

export type GetItemsInFolderPayload = {
  folderId?: string;
  companyId: string;
};
export interface GetItemsInFolderQuery {
  execute(payload: GetItemsInFolderPayload): Promise<GetItemsInFolderResponse>;
}
