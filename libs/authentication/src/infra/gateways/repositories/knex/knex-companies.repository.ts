import { CompaniesRepository } from '@app/authentication/hexagon/gateways/repositories/companies.repository';
import { Knex } from 'knex';
import { Company } from '@app/authentication/hexagon/models/company';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';

export class KnexCompaniesRepository implements CompaniesRepository {
  constructor(private readonly knex: Knex) {}

  save(company: Company): TransactionalAsync {
    return async (trx) => {
      const { id, name, createdAt } = company.snapshot;

      await this.knex
        .table('companies')
        .transacting(trx as Knex.Transaction)
        .insert({ id, name, createdAt })
        .onConflict('id')
        .merge();
    };
  }
}
