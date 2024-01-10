import { UsersRepository } from '@app/authentication/hexagon/gateways/repositories/users.repository';
import { User, UserSnapshot } from '@app/authentication/hexagon/models/user';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';

export class InMemoryUsersRepository implements UsersRepository {
  private _users: Map<string, UserSnapshot> = new Map();
  save(user: User): TransactionalAsync {
    return async () => {
      this._users.set(user.id, user.snapshot);
    };
  }

  get users(): User[] {
    return Array.from(this._users.values()).map((u) => User.fromSnapshot(u));
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = Array.from(this._users.values()).find(
      (u) => u.email === email,
    );
    if (!user) return;
    return User.fromSnapshot(user);
  }

  givenUsers(users: User[]) {
    users.forEach((u) => this._users.set(u.id, u.snapshot));
  }
}
