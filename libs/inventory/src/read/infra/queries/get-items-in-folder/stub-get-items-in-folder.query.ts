import {
  GetItemsInFolderPayload,
  GetItemsInFolderQuery,
  GetItemsInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';

export class StubGetItemsInFolderQuery implements GetItemsInFolderQuery {
  private _items: Map<string, GetItemsInFolderResponse> = new Map();
  async execute(
    payload: GetItemsInFolderPayload,
  ): Promise<GetItemsInFolderResponse> {
    return this._items.get(this.getKeyFromPayload(payload)) ?? [];
  }

  givenItems(
    payload: GetItemsInFolderPayload,
    items: GetItemsInFolderResponse,
  ) {
    this._items.set(this.getKeyFromPayload(payload), items);
  }

  private getKeyFromPayload(payload: GetItemsInFolderPayload) {
    return `${payload.folderId}-${payload.companyId}`;
  }
}
