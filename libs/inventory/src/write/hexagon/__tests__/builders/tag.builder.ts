import { Tag, TagSnapshot } from '@app/inventory/write/hexagon/models/tag';

export const tagBuilder = (
  snapshot: TagSnapshot = {
    id: 'c4d39ca6-6420-4c5d-9604-d7313d549745',
    name: 'tag-name',
    companyId: 'company-id',
    createdAt: new Date('2024-01-01'),
  },
) => {
  return {
    withId: (id: string) => tagBuilder({ ...snapshot, id }),
    withName: (name: string) => tagBuilder({ ...snapshot, name }),
    whitCompanyId: (companyId: string) =>
      tagBuilder({ ...snapshot, companyId }),
    withCreatedAt: (createdAt: Date) => tagBuilder({ ...snapshot, createdAt }),
    build: () => Tag.fromSnapshot(snapshot),
  };
};
