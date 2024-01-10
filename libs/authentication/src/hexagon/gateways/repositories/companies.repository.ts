import { Company } from '@app/authentication/hexagon/models/company';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';

export interface CompaniesRepository {
  save(company: Company): TransactionalAsync;
}
