export type GetTagsResponse = {
  id: string;
  name: string;
}[];

export interface GetTagsQuery {
  execute(companyId: string): Promise<GetTagsResponse>;
}
