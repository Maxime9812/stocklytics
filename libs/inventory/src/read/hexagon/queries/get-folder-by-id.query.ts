export type GetFolderByIdResponse = {
  id: string;
  name: string;
  parentId?: string;
  itemQuantity: number;
  companyId: string;
  createdAt: Date;
};

export interface GetFolderByIdQuery {
  execute(id: string): Promise<GetFolderByIdResponse | undefined>;
}
