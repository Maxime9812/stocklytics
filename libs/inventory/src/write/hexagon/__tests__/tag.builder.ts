import { Tag, TagSnapshot } from '@app/inventory/write/hexagon/models/tag';

export const tagBuilder = (
  snapshot: TagSnapshot = {
    id: 'tag-id',
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
