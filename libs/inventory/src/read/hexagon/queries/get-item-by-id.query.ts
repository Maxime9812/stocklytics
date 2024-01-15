export type GetItemByIdResponse = {
  id: string;
  companyId: string;
};

export interface GetItemByIdQuery {
  execute(id: string): Promise<GetItemByIdResponse | undefined>;
}
