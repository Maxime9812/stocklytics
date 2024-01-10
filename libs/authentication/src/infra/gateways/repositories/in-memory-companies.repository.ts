import { CompaniesRepository } from '@app/authentication/hexagon/gateways/repositories/companies.repository';
import {
  Company,
  CompanySnapshot,
} from '@app/authentication/hexagon/models/company';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';

export class InMemoryCompaniesRepository implements CompaniesRepository {
  private _companies: Map<string, CompanySnapshot> = new Map();

  get companies() {
    return Array.from(this._companies.values()).map((c) =>
      Company.fromSnapshot(c),
    );
  }

  save(company: Company): TransactionalAsync {
    return async () => {
      this._companies.set(company.id, company.snapshot);
    };
  }
}
