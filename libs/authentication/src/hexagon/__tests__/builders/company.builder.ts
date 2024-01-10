import {
  Company,
  CompanySnapshot,
} from '@app/authentication/hexagon/models/company';

export const companyBuilder = (
  snapshot: CompanySnapshot = {
    id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
    name: 'Stocklytics',
    createdAt: new Date('2024-01-01'),
  },
) => {
  return {
    withId: (id: string) => companyBuilder({ ...snapshot, id }),
    withName: (name: string) => companyBuilder({ ...snapshot, name }),
    createdAt: (createdAt: Date) => companyBuilder({ ...snapshot, createdAt }),
    build: () => Company.fromSnapshot(snapshot),
  };
};
