import { UsersRepository } from '@app/authentication/hexagon/gateways/repositories/users.repository';
import { Knex } from 'knex';
import { User } from '@app/authentication/hexagon/models/user';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';
import { UserPm } from '@app/authentication/infra/gateways/repositories/knex/persistent-models/user.pm';

export class KnexUsersRepository implements UsersRepository {
  constructor(private readonly knex: Knex) {}

  save(user: User): TransactionalAsync {
    return async (trx) => {
      const { id, email, password, createdAt, companyId, fullName } =
        user.snapshot;
      await this.knex('users')
        .transacting(trx as Knex.Transaction)
        .insert({
          id,
          email,
          password,
          fullName,
          companyId,
          createdAt,
        })
        .onConflict('id')
        .merge();
    };
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.knex<UserPm>('users').where({ email }).first();
    if (!user) return;
    return User.fromSnapshot({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      password: user.password,
      companyId: user.companyId,
      createdAt: user.createdAt,
    });
  }
}
