import { Company } from '@app/authentication/hexagon/models/company';
import { InMemoryCompaniesRepository } from '@app/authentication/infra/gateways/repositories/in-memory-companies.repository';

export const createCompaniesFixture = ({
  companiesRepository = new InMemoryCompaniesRepository(),
}: Partial<{ companiesRepository: InMemoryCompaniesRepository }>) => {
  return {
    thenCompaniesShouldBe(companies: Company[]) {
      expect(companiesRepository.companies.map((c) => c.snapshot)).toEqual(
        companies.map((c) => c.snapshot),
      );
    },
  };
};

export type CompaniesFixture = ReturnType<typeof createCompaniesFixture>;
