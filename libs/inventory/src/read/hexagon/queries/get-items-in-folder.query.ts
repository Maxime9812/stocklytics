export type GetItemsInFolderResponse = {
  id: string;
  name: string;
  folderId?: string;
  createdAt: Date;
  note: string;
  barcode?: {
    type: string;
    value: string;
  };
  tags: {
    id: string;
    label: string;
  }[];
  imageUrl?: string;
  quantity: number;
}[];

export type GetItemsInFolderPayload = {
  folderId?: string;
  companyId: string;
};
export interface GetItemsInFolderQuery {
  execute(payload: GetItemsInFolderPayload): Promise<GetItemsInFolderResponse>;
}
