import { User } from '@app/authentication/hexagon/models/user';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';

export interface UsersRepository {
  save(user: User): TransactionalAsync;
  getByEmail(email: string): Promise<User | undefined>;
}
