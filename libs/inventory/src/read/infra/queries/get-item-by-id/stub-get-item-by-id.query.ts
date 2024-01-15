import {
  GetItemByIdQuery,
  GetItemByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-item-by-id.query';

export class StubGetItemByIdQuery implements GetItemByIdQuery {
  private response: Map<string, GetItemByIdResponse> = new Map();
  async execute(id: string): Promise<GetItemByIdResponse | undefined> {
    return this.response.get(id);
  }

  givenItem(id: string, item: GetItemByIdResponse) {
    this.response.set(id, item);
  }
}
