import {
  GetTagsQuery,
  GetTagsResponse,
} from '@app/inventory/read/hexagon/queries/get-tags.query';

export class StubGetTagsQuery implements GetTagsQuery {
  private tags: Map<string, GetTagsResponse> = new Map();
  async execute(companyId: string): Promise<GetTagsResponse> {
    return this.tags.get(companyId) || [];
  }

  givenTags(companyId: string, response: GetTagsResponse): void {
    this.tags.set(companyId, response);
  }
}
