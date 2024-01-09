import { User } from '@app/authentication/hexagon/models/user';

export interface UsersRepository {
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<User | undefined>;
}
