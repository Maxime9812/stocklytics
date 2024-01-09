import { UsersRepository } from '@app/authentication/hexagon/gateways/users.repository';
import { User, UserSnapshot } from '@app/authentication/hexagon/models/user';

export class InMemoryUsersRepository implements UsersRepository {
  private _users: Map<string, UserSnapshot> = new Map();
  async save(user: User): Promise<void> {
    this._users.set(user.id, user.snapshot);
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
