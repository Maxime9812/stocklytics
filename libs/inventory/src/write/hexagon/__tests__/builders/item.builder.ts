import { Item, ItemSnapshot } from '@app/inventory/write/hexagon/models/item';

export const itemBuilder = (
  snapshot: ItemSnapshot = {
    id: 'item-id',
    companyId: 'company-id',
    name: 'item-name',
    createdAt: new Date('2024-01-01'),
    quantity: 1,
    price: 100,
    tagIds: [],
    folderId: undefined,
  },
) => {
  return {
    withId: (id: string) => itemBuilder({ ...snapshot, id }),
    withName: (name: string) => itemBuilder({ ...snapshot, name }),
    withCompanyId: (companyId: string) =>
      itemBuilder({ ...snapshot, companyId }),
    createdAt: (createdAt: Date) => itemBuilder({ ...snapshot, createdAt }),
    withQuantity: (quantity: number) => itemBuilder({ ...snapshot, quantity }),
    withPrice: (price: number) => itemBuilder({ ...snapshot, price }),
    whitTagIds: (...tagIds: string[]) => itemBuilder({ ...snapshot, tagIds }),
    withFolderId: (folderId: string) => itemBuilder({ ...snapshot, folderId }),
    build: () => Item.fromSnapshot(snapshot),
  };
};
