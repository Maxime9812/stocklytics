export type GetItemByIdResponse = {
  id: string;
  name: string;
  quantity: number;
  folderId?: string;
  companyId: string;
  note: string;
  barcode?: {
    type: string;
    value: string;
  };
  tags: {
    id: string;
    label: string;
  }[];
  createdAt: Date;
};

export interface GetItemByIdQuery {
  execute(id: string): Promise<GetItemByIdResponse | undefined>;
}
