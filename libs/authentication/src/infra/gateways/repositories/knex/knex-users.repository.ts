import { UsersRepository } from '@app/authentication/hexagon/gateways/users.repository';
import { Knex } from 'knex';
import { User } from '@app/authentication/hexagon/models/user';

export class KnexUsersRepository implements UsersRepository {
  constructor(private readonly knex: Knex) {}

  async save(user: User): Promise<void> {
    const { id, email, password, createdAt } = user.snapshot;
    await this.knex('users')
      .insert({
        id,
        email,
        password,
        createdAt,
      })
      .onConflict('id')
      .merge();
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.knex('users').where({ email }).first();
    if (!user) return;
    return User.fromSnapshot(user);
  }
}
