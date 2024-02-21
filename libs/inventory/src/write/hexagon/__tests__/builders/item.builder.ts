import {
  Item,
  ItemImage,
  ItemSnapshot,
} from '@app/inventory/write/hexagon/models/item';
import { Barcode } from '@app/inventory/write/hexagon/models/barcode';

export const itemBuilder = (
  snapshot: ItemSnapshot = {
    id: '0f8a84e4-c2ce-4999-bada-0f7a394626e8',
    companyId: '1c7bbeee-8f25-43da-93db-e1f025645257',
    name: 'item-name',
    createdAt: new Date('2024-01-01'),
    quantity: 1,
    note: '',
    tagIds: [],
    folderId: undefined,
    barcode: undefined,
  },
) => {
  return {
    withId: (id: string) => itemBuilder({ ...snapshot, id }),
    withName: (name: string) => itemBuilder({ ...snapshot, name }),
    withCompanyId: (companyId: string) =>
      itemBuilder({ ...snapshot, companyId }),
    createdAt: (createdAt: Date) => itemBuilder({ ...snapshot, createdAt }),
    withQuantity: (quantity: number) => itemBuilder({ ...snapshot, quantity }),
    whitTagIds: (...tagIds: string[]) => itemBuilder({ ...snapshot, tagIds }),
    withFolderId: (folderId: string) => itemBuilder({ ...snapshot, folderId }),
    withNote: (note: string) => itemBuilder({ ...snapshot, note }),
    withBarcode: (barcode: Barcode) => itemBuilder({ ...snapshot, barcode }),
    withoutBarcode: () => itemBuilder({ ...snapshot, barcode: undefined }),
    withImage: (image: ItemImage) => itemBuilder({ ...snapshot, image }),
    withoutImage: () => itemBuilder({ ...snapshot, image: undefined }),
    build: () => Item.fromSnapshot(snapshot),
  };
};
