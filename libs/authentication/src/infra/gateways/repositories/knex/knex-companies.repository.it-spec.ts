import knex, { Knex } from 'knex';
import { KnexTransactionPerformer } from '@app/shared/transaction-performing/knex-transacrion-performer';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexCompaniesRepository } from '@app/authentication/infra/gateways/repositories/knex/knex-companies.repository';
import { companyBuilder } from '@app/authentication/hexagon/__tests__/builders/company.builder';
import { CompanyPm } from '@app/authentication/infra/gateways/repositories/knex/persistent-models/company.pm';
import { Company } from '@app/authentication/hexagon/models/company';

describe('KnexCompaniesRepository', () => {
  let sqlConnection: Knex;
  let companiesRepository: KnexCompaniesRepository;
  let transactionPerformer: KnexTransactionPerformer;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    companiesRepository = new KnexCompaniesRepository(sqlConnection);
    transactionPerformer = new KnexTransactionPerformer(sqlConnection);
  });

  describe('save', () => {
    it('should save company', async () => {
      const company = companyBuilder()
        .withId('ec8142a6-5de5-45d5-95a5-d0e70b683481')
        .withName('Stocklytics')
        .createdAt(new Date('2024-01-01'))
        .build();

      await transactionPerformer.perform(async (trx) => {
        await companiesRepository.save(company)(trx);
      });

      expect(await findExistingCompanies()).toEqual<CompanyPm[]>([
        {
          id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
          name: 'Stocklytics',
          createdAt: new Date('2024-01-01'),
        },
      ]);
    });

    it('should update company if already exists', async () => {
      const initialCompanyBuilder = companyBuilder()
        .withId('ec8142a6-5de5-45d5-95a5-d0e70b683481')
        .withName('Stocklytics')
        .createdAt(new Date('2024-01-01'));

      await insertCompany(initialCompanyBuilder.build());

      const updatedCompany = companyBuilder().withName('Stocklytics 2').build();

      await transactionPerformer.perform(async (trx) => {
        await companiesRepository.save(updatedCompany)(trx);
      });

      expect(await findExistingCompanies()).toEqual<CompanyPm[]>([
        {
          id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
          name: 'Stocklytics 2',
          createdAt: new Date('2024-01-01'),
        },
      ]);
    });
  });

  const insertCompany = async (company: Company) => {
    const { id, name, createdAt } = company.snapshot;
    await sqlConnection.table('companies').insert({
      id,
      name,
      createdAt,
    });
  };
  const findExistingCompanies = async () => {
    return sqlConnection.table<CompanyPm[]>('companies').select('*');
  };
});
