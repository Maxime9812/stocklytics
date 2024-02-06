export type GetItemByIdResponse = {
  id: string;
  name: string;
  quantity: number;
  folderId?: string;
  companyId: string;
  note: string;
  createdAt: Date;
};

export interface GetItemByIdQuery {
  execute(id: string): Promise<GetItemByIdResponse | undefined>;
}
